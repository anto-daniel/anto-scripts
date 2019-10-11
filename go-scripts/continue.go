package main

import "fmt"

func main() {
	/* defining our local variable */
	var x int = 20
	/* execution of do loop */
	for x < 30 {
		if x == 25 {
			/* skipping the iteration */
			x = x + 1
			continue
		}
		fmt.Printf("The value of x is: %d\n", x)
		x++
	}
}
