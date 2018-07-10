import System.IO  
import Control.Monad
import Data.List
import Data.List.Split
import Data.Char
import qualified Data.Text as T
import GHC.Exts (groupWith)

data Row = Row { person :: Int,  column :: Int, quality :: Float, business :: Float } deriving Show

conv :: [String] -> Row
conv s = Row (read (s!!1)) (read (s!!2)) (read (s!!3)) (read (s!!4))

strip :: String -> String
strip = T.unpack . T.strip . T.pack

cells :: String -> [[String]]
cells s = map (map strip . wordsBy (=='|')) $ drop 2 $ lines s

allEq :: Eq a => [a] -> Maybe a
allEq [] = Nothing
allEq (x:xs)
  | all (== x) xs = Just x
  | otherwise = Nothing

mean :: [Float] -> Float
mean xs = sum xs / fromIntegral (length xs)

stdev :: [Float] -> Float
stdev xs = sqrt $ mean $ map (\x -> (x - mean xs) ^^ 2) xs

red :: ([Float] -> Float) -> [Row] -> Row
red f rs = Row (m p) (m c) (a quality rs) (a business rs)
  where
    a col = f . (map col)
    m = maybe 0 id
    p = allEq $ map person rs
    c =  allEq $ map column rs

main = do
  h <- openFile "data.txt" ReadMode
  cont <- hGetContents h
  let d = map conv $ cells cont
  let pred col f = print $ map (red f) $ groupWith col d
  pred column mean
  pred column stdev
  pred person mean
  pred person stdev
  hClose h