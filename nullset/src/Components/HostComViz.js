import { Link } from 'react-router-dom';
import { useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import '../App.css';

const HostComViz = () => {
    
    const svgRef = useRef()
    const wrapperRef = useRef();
    const tooltipRef = useRef();
    const width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 2.5;

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const tooltip = d3.select(tooltipRef.current)

        tooltip.attr("class", "tooltip")
        .attr('style', 'position: absolute; opacity: 0;');

        const createNetwork = (edgeList) => {
            const nodeHash = {};
            const nodes = [];
            const edges = [];

            Array.prototype.forEach.call(edgeList, (edge) => {
                if (!nodeHash[edge._source.layers.ip["ip.src"]]) {
                    nodeHash[edge._source.layers.ip["ip.src"]] = {id: edge._source.layers.ip["ip.src"], label: edge._source.layers.ip["ip.src"], weight: 1, fixed: false, totalbytes: 
                        parseInt(edge._source.layers.tcp["tcp.len"]), largestTran: parseInt(edge._source.layers.tcp["tcp.len"])};
                    nodes.push(nodeHash[edge._source.layers.ip["ip.src"]]);
                } else {
                    nodeHash[edge._source.layers.ip["ip.src"]].weight = nodeHash[edge._source.layers.ip["ip.src"]].weight + 1
                    nodeHash[edge._source.layers.ip["ip.src"]].totalbytes = nodeHash[edge._source.layers.ip["ip.src"]].totalbytes + parseInt(edge._source.layers.tcp["tcp.len"])
                    if (parseInt(edge._source.layers.tcp["tcp.len"]) > nodeHash[edge._source.layers.ip["ip.src"]].largestTran) {
                        nodeHash[edge._source.layers.ip["ip.src"]].largestTran = parseInt(edge._source.layers.tcp["tcp.len"])
                    }
                }
                if (!nodeHash[edge._source.layers.ip["ip.dst"]]) {
                    nodeHash[edge._source.layers.ip["ip.dst"]] = {id: edge._source.layers.ip["ip.dst"], label: edge._source.layers.ip["ip.dst"], weight: 1, fixed: false, totalbytes: 
                        parseInt(edge._source.layers.tcp["tcp.len"]), largestTran: parseInt(edge._source.layers.tcp["tcp.len"])};
                    nodes.push(nodeHash[edge._source.layers.ip["ip.dst"]]);
                } else {
                    nodeHash[edge._source.layers.ip["ip.dst"]].weight = nodeHash[edge._source.layers.ip["ip.dst"]].weight + 1
                    nodeHash[edge._source.layers.ip["ip.dst"]].totalbytes = nodeHash[edge._source.layers.ip["ip.dst"]].totalbytes + parseInt(edge._source.layers.tcp["tcp.len"])
                    if (parseInt(edge._source.layers.tcp["tcp.len"]) > nodeHash[edge._source.layers.ip["ip.dst"]].largestTran) {
                        nodeHash[edge._source.layers.ip["ip.dst"]].largestTran = parseInt(edge._source.layers.tcp["tcp.len"])
                    }
                }
                if (edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"]) === -1) {
                    edges.push({name: edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"], source: nodeHash[edge._source.layers.ip["ip.src"]], 
                        target: nodeHash[edge._source.layers.ip["ip.dst"]], weight: 1});
                } else {
                    edges[edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"])].weight = 
                        edges[edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"])].weight + 1
                }
            });

            const min = nodes.reduce(function(prev, current) {
                    return (prev.weight < current.weight) ? prev : current
            })
            const max = Math.max.apply(Math, nodes.map(function(o) {
                    return o.weight; 
            }))

            const x = d3.scaleLog()
            .domain([min.weight, max])
            .range([3, 20])

            x.clamp(true)

            nodes.forEach(function(obj) {
                obj.totalcomm = obj.weight
                obj.weight = x(obj.weight)
            })

            createForceNetwork(nodes, edges);
        }

        function createForceNetwork(nodes, edges) {
            console.log("creating")
            //create a network from an edgelist
            const force = d3.forceSimulation(nodes)
            .force('link', d3.forceLink().links(edges))
            .force("forceX", d3.forceX().strength(.1).x(width * .5))
            .force("forceY", d3.forceY().strength(.1).y(height * .5))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            // .force('charge', d3.forceManyBody().strength(d => Math.min(-100, d.weight * -50)))
            .force('charge', d3.forceManyBody().strength(-5000))

            force.on("tick", updateNetwork);

            svg.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke-width", "1px")
            .style("stroke", "#456682");

            const nodeEnter = svg.selectAll("g.node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("click", nodeClick)
            .on("mouseover", nodeOver)
            .on("mouseout", nodeOut)
            .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));

            nodeEnter.append("circle")
            .attr("fill", "#9ED2FF")
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .attr("r", 5)
            .on("mouseover", function(event, d) {
                tooltip.transition()
                    .duration(200)
                    .style("opacity", 1);

                tooltip.style("left", (event.screenX + 30) + "px")
                    .style("top", (event.screenY - 180) + "px");
                tooltip.html("<p id='comm'>" + "Total Communications: " + d.totalcomm +
                "</p>" + "<p>" + "Total Bytes Transferred: " + d.totalbytes + "</p>" +
                "<p>" + "Average Byte Transfer: " + Math.round(d.totalbytes / d.totalcomm) + "</p>" +
                "<p>" + "Largest Transfer: " + d.largestTran + "</p>")

            })
            .on("mouseout", function (d) {
            tooltip.transition()
                .duration(0)
                .style("opacity", 0)
            tooltip.html("")
            // tooltip.selectAll("svg")
            //     .attr("height", "0px")
            //     .attr("width", "0px")
        });

            nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            // .style("stroke-width", "1px")
            // .style("stroke-opacity", 0.75)
            // .style("stroke", "black")
            .style("font-size", "12px")
            .text(function (d) {return d.id})
            .style("pointer-events", "none")

            nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            .style("font-size", "12px")
            .text(function (d) {return d.id})
            .style("pointer-events", "none")

            function dragstarted(event, d) {
                if (!event.active) force.alphaTarget(.03).restart();
                d.fx = d.x;
                d.fy = d.y;
            }

            function dragged(event, d) {
                d.fx = event.x;
                d.fy = event.y;
            }

            function dragended(event, d) {
                if (!event.active) force.alphaTarget(.03);
                d.fx = event.x;
                d.fy = event.y;
            }

            function nodeClick(event, d) {
                if (d.fixed) {
                    d.fx = null;
                    d.fy = null;
                } else {
                    d.fixed = true
                    d.fx = d.x;
                    d.fy = d.y;
                }
            }

            function nodeOver(event, d) {
                force.stop();
                highlightEgoNetwork(d);
            }

            function nodeOut() {
                force.restart();
                d3.selectAll("g.node > circle")
                .style("fill", "#9ED2FF");

                d3.selectAll("line")
                .style("stroke", "#456682")
                .style("stroke-width", "1px");
            }

            function highlightEgoNetwork(d) {
                var egoIDs = [];
                var filteredEdges = edges.filter(function (p) {return p.source === d || p.target === d});

                filteredEdges
                .forEach(function (p) {
                if (p.source === d) {
                    egoIDs.push(p.target.id)
                }
                else {
                    egoIDs.push(p.source.id)
                }
                });

                d3.selectAll("line").filter(function (p) {return filteredEdges.indexOf(p) > -1})
                .style("stroke", "#13F4EF")

                d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) > -1})
                .style("fill", "#13F4EF");
            }

            function updateNetwork() {
                svg.selectAll("line")
                .attr("x1", function (d) {return d.source.x})
                .attr("y1", function (d) {return d.source.y})
                .attr("x2", function (d) {return d.target.x})
                .attr("y2", function (d) {return d.target.y})
                .style("stroke-width", function (d) {
                    return d.weight + "" + "px"
                })

                svg.selectAll("g.node")
                .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

                svg.selectAll("g.node > circle")
                .attr("r", function (d) {return d.weight * 4}); //weiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiight

            }
        }
        const data = require('./test.json');
        createNetwork(data)
    }, [width, height])
    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}></svg>
            <div ref={tooltipRef}></div>
        </div>
    );
}

export default HostComViz
