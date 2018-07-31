package main

import (
	"fmt"
	"math/rand"
)

// WeightedRand takes an slice of weights and returns a random index from the slice.
// The probablity of picking an index is proportional to the value at that entry.
// If all weights are zero, every index has equal probabliity.
// WeightedRand panicks if the slice is empty or weights are negative.
func WeightedRand(weights []float32) int {
	if len(weights) == 0 {
		panic("empty weights slice")
	}

	rest := make([]float32, len(weights))
	for i, w := range weights {
		if w < 0 {
			panic(fmt.Sprintf("negative weight: weights[%v] == %v", i, w))
		}
		for j := 0; j < i; j++ {
			rest[j] += w
		}
	}

	for i, w := range weights {
		if (rand.Float32() * (rest[i] + w)) < w {
			return i
		}
	}

	// all weights were zero
	return rand.Intn(len(weights))
}
