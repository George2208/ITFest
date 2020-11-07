function CanvasBackground (id, options) {
    function Boundary(x, y, radius) { [this.x,this.y,this.radius]=[x-radius,y-radius,radius] }
    class Particle {
        constructor(x, y, dx, dy) { [this.x,this.y,this.dx,this.dy]=[x,y,dx,dy] }
        update() {
            if (this.x>ctx.canvas.width||this.x<0) this.dx *= -1
            if (this.y>ctx.canvas.height||this.y<0) this.dy *= -1
            this.x += this.dx*options.pointSpeed
            this.y += this.dy*options.pointSpeed
        }
        insideCircle(boundary) {
            let x = boundary.x+boundary.radius
            let y = boundary.y+boundary.radius
            return (this.x-x)**2+(this.y-y)**2<boundary.radius**2
    }}
    class QuadTree {
        constructor(x, y, width, height, maxPoints=5) { [this.x,this.y,this.width,this.height,this.list,this.capacity,this.split]=[x,y,width,height,[],maxPoints,false] }
        passPoint(point) {
            if(point.x>=this.x+this.width/2) {
                if(point.y<this.y+this.height/2) this.ne.add(point)
                else this.se.add(point)
            } else {
                if(point.y<this.y+this.height/2) this.nw.add(point)
                else this.sw.add(point)
        }}
        add(point) {
            if(this.split) { this.passPoint(point) }
            else {
                this.list.push(point)
                if(this.list.length>this.capacity&&this.width+this.height>20) {
                    let [w,h]=[this.width/2,this.height/2]
                    this.split = true
                    this.nw = new QuadTree(this.x, this.y, w, h)
                    this.ne = new QuadTree(this.x+w, this.y, w, h)
                    this.sw = new QuadTree(this.x, this.y+h, w, h)
                    this.se = new QuadTree(this.x+w, this.y+h, w, h)
                    while(this.list.length>0) this.passPoint(this.list.pop())
        }}}
        query(boundary) {
            if(this.x>boundary.x+boundary.width||this.y>boundary.y+boundary.height||this.x+this.width<boundary.x||this.y+this.height<boundary.y) return []
            if(this.split) return [...this.nw.query(boundary), ...this.ne.query(boundary), ...this.sw.query(boundary), ...this.se.query(boundary)]
            return this.list
    }}
    this.animate = () => {
        requestAnimationFrame(this.animate.bind(this))
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        let qtree = new QuadTree(0, 0, ctx.canvas.width, ctx.canvas.height)
        let boundary = new Boundary(mouse.x, mouse.y, options.mouseActivationRadius)
        for (let i = 0; i < particlesArray.length; i++)
            qtree.add(particlesArray[i])
        let area1 = qtree.query(boundary)
        ctx.lineWidth = options.lineWidth
        for (let i=0; i<area1.length; i++) {
            if(area1[i].insideCircle(boundary)) {
                let partialOpacity = 1-((mouse.x-area1[i].x)**2+(mouse.y-area1[i].y)**2)/options.mouseActivationRadius**2
                boundary2 = new Boundary(area1[i].x, area1[i].y, options.pointActivationRadius)
                let area2 = qtree.query(boundary2)
                for (let j=0; j<area2.length; j++) {
                    if(area2[j].insideCircle(boundary2)) {
                        let opacity = partialOpacity-partialOpacity*((area2[j].x-area1[i].x)**2+(area2[j].y-area1[i].y)**2)/options.pointActivationRadius**2
                        ctx.beginPath()
                        ctx.strokeStyle = `rgba(${options.lineColor[0]}, ${options.lineColor[1]}, ${options.lineColor[2]}, ${options.lineOpacity*opacity})`
                        ctx.moveTo(area1[i].x, area1[i].y)
                        ctx.lineTo(area2[j].x, area2[j].y)  
                        ctx.stroke()
                        ctx.beginPath()
                        ctx.fillStyle = `rgba(${options.pointColor[0]}, ${options.pointColor[1]}, ${options.pointColor[2]}, ${options.pointOpacity*opacity})`
                        ctx.arc(area2[j].x, area2[j].y, options.pointRadius, 0, Math.PI * 2)
                        ctx.fill()
        }}}}
        if (options.pointVisibility) {
            ctx.fillStyle = `rgba(${options.pointColor[0]}, ${options.pointColor[1]}, ${options.pointColor[2]}, ${options.pointVisibility})`
            for (let i=0; i<particlesArray.length; i++) {
                ctx.beginPath()
                ctx.arc(particlesArray[i].x, particlesArray[i].y, options.pointRadius, 0, Math.PI * 2)
                ctx.fill()
        }}
        for (let i=0; i<particlesArray.length; i++)
            particlesArray[i].update()
    }
    this.set = (dict) => {
        for (i in dict) {
            if (!(i in options)) {
                console.log("'"+i+"' is not a valid attribute.")
                continue
            }
            options[i] = dict[i]
            if (i=="pointNumber") {
                if (options.pointNumber < particlesArray.length)
                    particlesArray.length = options.pointNumber
                while (options.pointNumber > particlesArray.length)
                    particlesArray.push(new Particle(Math.random() * ctx.canvas.width, Math.random()*ctx.canvas.height, Math.random()*2-1, Math.random()*2-1))
    }}}
    options = Object.assign({}, {
        lineOpacity: 1,
        pointOpacity: 1,
        pointVisibility: 0.3,
        lineColor: [0, 0, 0],
        lineWidth: 1,
        pointColor: [0, 0, 0],
        pointRadius: 1.5,
        mouseActivationRadius: 300,
        pointActivationRadius: 200,
        pointNumber: 100,
        pointSpeed: 2
    }, options)
    let [ctx,particlesArray,mouse] = [document.getElementById(id).getContext("2d"),[],{x:null,y:null}]
    ctx.canvas.width = ctx.canvas.getBoundingClientRect().width, ctx.canvas.height = ctx.canvas.getBoundingClientRect().height
    this.set(options)   
    this.animate()
    window.addEventListener("mousemove", (e) => {
        mouse.x = e.x-ctx.canvas.getBoundingClientRect().x
        mouse.y = e.y-ctx.canvas.getBoundingClientRect().y
    })
    window.addEventListener("resize", () => {
        ctx.canvas.width = ctx.canvas.getBoundingClientRect().width
        ctx.canvas.height = ctx.canvas.getBoundingClientRect().height
    })
}
