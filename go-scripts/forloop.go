package main

import "fmt"

func main() {
	var y int = 10
	/* var x int */
	numbers := [6]int{1, 2, 3, 5}
	/* execution of for loop */
	for x := 0; x <= 5; x++ {
		fmt.Printf("value of x: %d\n", x)
		for x < y {
			x++
			fmt.Printf("The value of x: %d\n", x)
		}
		for j, z := range numbers {
			fmt.Printf("The value of z = %d at %d\n", z, j)
		}
	}
}
