package main

import "fmt"

func swap(a, b string) (string, string) {
	return b, a
}

func main() {
	x, y := swap("Nicholas", "John")
	fmt.Println(x, y)
}
