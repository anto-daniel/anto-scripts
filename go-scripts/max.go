package main

import "fmt"

func main() {
	var x int = 50
	var y int = 100
	var ret int
	ret = max(x, y)
	fmt.Printf("max value is: %d\n", ret)
}

func max(number1, number2 int) int {
	var result int
	if number1 > number2 {
		result = number1
	} else {
		result = number2
	}
	return result
}
