package main_test

import (
	"fmt"
	"math"
	"testing"

	main "github.com/tehwalris/coffee-random/backend"
)

func TestWeightedRand(t *testing.T) {
	iterations := 10000
	tolerance := 0.01

	cases := []struct {
		weights []float32
		prob    []float32 // Probability for each index (sum 1). Nil if error expected.
	}{
		{[]float32{}, nil},
		{[]float32{-1.0}, nil},
		{[]float32{1.1, -0.1, -3.3, 2.0}, nil},
		{[]float32{0}, []float32{1}},
		{[]float32{0, 0, 0, 0}, []float32{0.25, 0.25, 0.25, 0.25}},
		{[]float32{1}, []float32{1}},
		{[]float32{1, 1}, []float32{0.5, 0.5}},
		{[]float32{12.34, 12.34}, []float32{0.5, 0.5}},
		{[]float32{1, 2, 3, 4}, []float32{0.1, 0.2, 0.3, 0.4}},
		{[]float32{4, 3, 2, 1}, []float32{0.4, 0.3, 0.2, 0.1}},
	}

	for i, c := range cases {
		t.Run(fmt.Sprintf("case %v", i), func(t *testing.T) {
			defer func() {
				r := recover()
				if c.prob == nil && r == nil {
					t.Errorf("did not panic, expected panic")
				}
				if c.prob != nil && r != nil {
					t.Errorf("unexpected panic: %v", r)
				}
			}()

			main.WeightedRand(c.weights)
			if c.prob == nil {
				return
			}

			counts := make([]int, len(c.weights))
			for i := 0; i < iterations; i++ {
				counts[main.WeightedRand(c.weights)]++
			}

			for i, exp := range c.prob {
				act := float32(counts[i]) / float32(iterations)
				if math.Abs(float64(act-exp)) > tolerance {
					t.Errorf("wrong probability for index %v: got %v, want %v", i, act, exp)
				}
			}
		})
	}
}
