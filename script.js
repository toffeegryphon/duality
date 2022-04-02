let canvas
let bounds
let ctx

let props = {
	"size"	: { "x": 400, "y": 400 },
	"isLineStarted"	: false,
	"prevPoint"	: undefined,
	"lines"	: [],
	"points": []
}

$(document).ready(() => {
	canvas	= $("#canvas")
	bounds	= canvas.get(0).getBoundingClientRect()
	ctx	= canvas.get(0).getContext("2d")

	ctx.lineWidth = 4

	canvas.mousedown(onMousedown)
	canvas.contextmenu(dualize)

	btn	= $("#generate")
	btn.click(onSubmit)
})

function onSubmit(event) {
	let a = parseInt($("#ainput").val())
	let b = parseInt($("#binput").val())
	let c = parseInt($("#cinput").val())
	let t = parseInt($("#tinput").val())
	obj = { a, b, c }
	switch (t) {
		case 0:
			props.lines.push(obj)
			drawLine(obj)
			break
		case 1:
			props.points.push(obj)
			drawPoint(obj)
			break
	}
}

function getMousePosition(event) {
	let x = event.clientX - bounds.left - props.size.x / 2
	let y = bounds.bottom - event.clientY - props.size.y / 2

	return {x, y}
}

function toCanvasPosition(pos) {
	let x = pos.x + props.size.x / 2
	let y = props.size.y / 2 - pos.y

	return {x, y}
}

function generateObj(pos1, pos2) {
	a = (pos2.y - pos1.y) / (pos2.x - pos1.x)
	b = pos2.y - a * pos2.x

	return { a, b }
}

function drawLine(obj) {
	let start = toCanvasPosition({"x": -props.size.x / 2, "y": -obj.a * props.size.x / 2 + obj.b})
	let end = toCanvasPosition({"x": props.size.x / 2, "y": obj.a * props.size.x / 2 + obj.b})
	if (obj.c !== undefined) {
		switch (obj.c) {
			case 0:
				ctx.strokeStyle = "blue"
				break
			case 1:
				ctx.strokeStyle = "red"
				break
		}
	} else {
		ctx.strokeStyle = "black"
	}
	ctx.beginPath()
	ctx.moveTo(start.x, start.y)
	ctx.lineTo(end.x, end.y)
	ctx.stroke()
}

function drawPoint(obj) {
	ctx.beginPath()
	pos = toCanvasPosition({"x": obj.a, "y": obj.b})
	if (obj.c !== undefined) {
		switch (obj.c) {
			case 0:
				ctx.fillStyle = "blue"
				break
			case 1:
				ctx.fillStyle = "red"
				break
		}
	} else {
		ctx.fillStyle = "black"
	}
	ctx.arc(pos.x, pos.y, 4, 0, 2 * Math.PI, false)
	ctx.fill()
}

function dualize(event) {
	event.preventDefault()

	ctx.clearRect(0, 0, props.size.x, props.size.y)

	points	= props.points
	lines	= props.lines

	props.points	= lines
	props.lines	= points
	
	props.lines.forEach(obj => {
		drawLine(obj)
	})


	props.points.forEach(obj => {
		drawPoint(obj)
	})
}

function onMousedown(event) {
	if (event.which == 3) { return }

	let pos	= getMousePosition(event)
	if (!props.isLineStarted) {
		props.prevPoint = pos
		props.isLineStarted = true
	} else {
		let obj = generateObj(props.prevPoint, pos)
		props.lines.push(obj)
		drawLine(obj)
		props.isLineStarted = false
	}
}
