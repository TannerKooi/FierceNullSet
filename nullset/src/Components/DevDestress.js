import { useRef, useEffect, useState} from 'react';
import * as d3 from 'd3'
import data from './new2.csv'

const DevDestress = () => {
    const svgRef = useRef()
    const width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 2.5;


    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const color = d3.scaleOrdinal(["#66c2a5", "#fc8d62", "#8da0cb", "#e78ac3", "#a6d854", "#ffd92f", "#e5c494", "#b3b3b3"]);

        const simulation = d3.forceSimulation()
            .force("forceX", d3.forceX().strength(.1).x(width * .5))
            .force("forceY", d3.forceY().strength(.1).y(height * .5))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            .force("charge", d3.forceManyBody().strength(-15));

        d3.csv(data, types).then(function(graph) {

            // sort the nodes so that the bigger ones are at the back
            graph = graph.sort(function(a,b){ return b.size - a.size; });

            //update the simulation based on the data
            simulation
                .nodes(graph)
                .force("collide", d3.forceCollide().strength(.5).radius(function(d){ return d.radius + nodePadding; }).iterations(1))
                .on("tick", function(d){
                    node
                        .attr("cx", function(d){ return d.x; })
                        .attr("cy", function(d){ return d.y; })
                })

            var node = svg.append("g")
                .attr("class", "node")
                .selectAll("circle")
                .data(graph)
                .enter().append("circle")
                .attr("r", function(d) { return d.radius; })
                .attr("fill", function(d) { return color(d.continent); })
                .attr("cx", function(d){ return d.x; })
                .attr("cy", function(d){ return d.y; })
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            });

            function dragstarted(event, d) {
                if (!event.active) simulation.alphaTarget(.03).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) simulation.alphaTarget(.03);
                d.fx = null;
                d.fy = null;
            }

            function types(d){
                d.gdp = +d.gdp;
                d.size = +d.gdp / sizeDivisor;
                d.size < 3 ? d.radius = 3 : d.radius = d.size;
                return d;
            }
    }, [height, width])
    
    return (
        <div>
            <svg ref={svgRef}></svg>
        </div>
    )
}

export default DevDestress

