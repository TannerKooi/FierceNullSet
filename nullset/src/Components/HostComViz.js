// import { Link } from 'react-router-dom';
// import { useRef, useEffect, useState} from 'react';
// import * as d3 from 'd3';
// // import { forceManyBody, forceSimulation } from 'd3';
// import useResizeObserver from './ResizeObserver'

// const HostComViz = ({ data }) => {
//     // console.log(data)
    
//     const svgRef = useRef()
//     const wrapperRef = useRef();
//     // const dimensions = useResizeObserver(wrapperRef);
//     const width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 2.5;

//     useEffect(() => {
//         const svg = d3.select(svgRef.current)
//             .attr("width", width)
//             .attr("height", height);

//         const createNetwork = (edgeList) => {
//             const nodeHash = {};
//             const nodes = [];
//             const edges = [];
//             console.log(edgeList)

//             Array.prototype.forEach.call(edgeList, (edge) => {
//                 console.log(edge.source)
//                 console.log(nodeHash[edge.source])
//                 if (!nodeHash[edge.source]) {
//                     nodeHash[edge.source] = {id: edge.source, label: edge.source, weight: edge.weight, fixed: false};
//                     nodes.push(nodeHash[edge.source]);
//                 }
//                 if (!nodeHash[edge.target]) {
//                     nodeHash[edge.target] = {id: edge.target, label: edge.target, weight: edge.weight, fixed: false};
//                     nodes.push(nodeHash[edge.target]);
//                 }
//                 if (edge.weight >= 5) {
//                     edges.push({source: nodeHash[edge.source], target: nodeHash[edge.target], weight: edge.weight});
//                 }
//             });
//             console.log(nodeHash)
//             // console.log(nodes)
//             // console.log(edges)
//             createForceNetwork(nodes, edges);
//         }

//         function createForceNetwork(nodes, edges) {

//             //create a network from an edgelist
//             const force = d3.forceSimulation(nodes)
//             .force('link', d3.forceLink().links(edges))
//             .force("forceX", d3.forceX().strength(.1).x(width * .5))
//             .force("forceY", d3.forceY().strength(.1).y(height * .5))
//             .force("center", d3.forceCenter().x(width * .5).y(height * .5))
//             .force('charge', d3.forceManyBody().strength(d => Math.min(-100, d.weight * -50)))
//             .on("tick", updateNetwork);

//             // console.log(edges)
//             svg.selectAll("line")
//             .data(edges)
//             .enter()
//             .append("line")
//             .style("stroke-width", "1px")
//             .style("stroke", "#996666");

//             const nodeEnter = svg.selectAll("g.node")
//             .data(nodes)
//             .enter()
//             .append("g")
//             .attr("class", "node")
//             .on("click", nodeClick)
//             .on("mouseover", nodeOver)
//             .on("mouseout", nodeOut)
//             .call(d3.drag()
//                     .on("start", dragstarted)
//                     .on("drag", dragged)
//                     .on("end", dragended));

//             nodeEnter.append("circle")
//             .attr("fill", "#CC9999")
//             .attr("stroke", "black")
//             .attr("stroke-width", "1px")
//             .attr("r", 5)

//             nodeEnter.append("text")
//             .style("text-anchor", "middle")
//             .attr("y", 2)
//             .style("stroke-width", "1px")
//             .style("stroke-opacity", 0.75)
//             .style("stroke", "white")
//             .style("font-size", "8px")
//             .text(function (d) {return d.id})
//             .style("pointer-events", "none")

//             nodeEnter.append("text")
//             .style("text-anchor", "middle")
//             .attr("y", 2)
//             .style("font-size", "8px")
//             .text(function (d) {return d.id})
//             .style("pointer-events", "none")

//             function dragstarted(event, d) {
//                 if (!event.active) force.alphaTarget(.03).restart();
//                 d.fx = d.x;
//                 d.fy = d.y;
//             }

//             function dragged(event, d) {
//                 d.fx = event.x;
//                 d.fy = event.y;
//             }

//             function dragended(event, d) {
//                 if (!event.active) force.alphaTarget(.03);
//                 d.fx = event.x;
//                 d.fy = event.y;
//             }

//             function nodeClick(event, d) {
//                 if (d.fixed) {
//                     d.fx = null;
//                     d.fy = null;
//                 } else {
//                     d.fixed = true
//                     d.fx = d.x;
//                     d.fy = d.y;
//                 }
//             }

//             function nodeOver(event, d) {
//                 force.stop();
//                 highlightEgoNetwork(d);
//             }

//             function nodeOut() {
//                 force.restart();
//                 d3.selectAll("g.node > circle")
//                 .style("fill", "#CC9999");

//                 d3.selectAll("line")
//                 .style("stroke", "#996666")
//                 .style("stroke-width", "1px");
//             }

//             function highlightEgoNetwork(d) {
//                 var egoIDs = [];
//                 var filteredEdges = edges.filter(function (p) {return p.source === d || p.target === d});

//                 filteredEdges
//                 .forEach(function (p) {
//                 if (p.source === d) {
//                     egoIDs.push(p.target.id)
//                 }
//                 else {
//                     egoIDs.push(p.source.id)
//                 }
//                 });

//                 d3.selectAll("line").filter(function (p) {return filteredEdges.indexOf(p) > -1})
//                 .style("stroke", "#66CCCC")
//                 .style("stroke-width", "2px");

//                 d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) > -1})
//                 .style("fill", "#66CCCC");
//             }

//             function updateNetwork() {
//                 svg.selectAll("line")
//                 .attr("x1", function (d) {return d.source.x})
//                 .attr("y1", function (d) {return d.source.y})
//                 .attr("x2", function (d) {return d.target.x})
//                 .attr("y2", function (d) {return d.target.y});

//                 svg.selectAll("g.node")
//                 .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

//                 svg.selectAll("g.node > circle")
//                 .attr("r", function (d) {return d.weight * 4});

//             }
//         }
//         d3.csv(data).then(function(data) {createNetwork(data)});
//     }, [data, width, height])
//     return (
//         <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
//             <svg ref={svgRef}></svg>
//         </div>
//     );
// }

// export default HostComViz

import { Link } from 'react-router-dom';
import { useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
// import { forceManyBody, forceSimulation } from 'd3';
import useResizeObserver from './ResizeObserver'

const HostComViz = ({ data }) => {
    // console.log(data)
    
    const svgRef = useRef()
    const wrapperRef = useRef();
    // const dimensions = useResizeObserver(wrapperRef);
    const width = window.innerWidth, height = window.innerHeight, sizeDivisor = 100, nodePadding = 2.5;

    useEffect(() => {
        const svg = d3.select(svgRef.current)
            .attr("width", width)
            .attr("height", height);

        const createNetwork = (edgeList) => {
            const nodeHash = {};
            const nodes = [];
            const edges = [];
            console.log(edgeList)
            // const x = d3.scaleLinear()
            //     .domain([1, 300])
            //     .range([1, 20])
            // x.clamp(true);

            Array.prototype.forEach.call(edgeList, (edge) => {
                if (!nodeHash[edge._source.layers.ip["ip.src"]]) {
                    nodeHash[edge._source.layers.ip["ip.src"]] = {id: edge._source.layers.ip["ip.src"], label: edge._source.layers.ip["ip.src"], weight: 1, fixed: false};
                    nodes.push(nodeHash[edge._source.layers.ip["ip.src"]]);
                } else {
                    nodeHash[edge._source.layers.ip["ip.src"]].weight = nodeHash[edge._source.layers.ip["ip.src"]].weight + 1
                }
                if (!nodeHash[edge._source.layers.ip["ip.dst"]]) {
                    nodeHash[edge._source.layers.ip["ip.dst"]] = {id: edge._source.layers.ip["ip.dst"], label: edge._source.layers.ip["ip.dst"], weight: 1, fixed: false};
                    nodes.push(nodeHash[edge._source.layers.ip["ip.dst"]]);
                } else {
                    nodeHash[edge._source.layers.ip["ip.dst"]].weight = nodeHash[edge._source.layers.ip["ip.dst"]].weight + 1
                }
                // console.log('ah')
                // edges.findIndex(element => console.log(element))
                // console.log(edges.findIndex(element => element.name ==='14.56.180.103128.208.4.40'))
                if (edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"]) === -1) {
                    edges.push({name: edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"], source: nodeHash[edge._source.layers.ip["ip.src"]], 
                        target: nodeHash[edge._source.layers.ip["ip.dst"]], weight: 1});
                } else {
                    // console.log(edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"]))
                    edges[edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"])].weight = 
                        edges[edges.findIndex(element => element.name === edge._source.layers.ip["ip.src"] + '' + edge._source.layers.ip["ip.dst"])].weight + 1
                }
            });
                        console.log('nodes')
            console.log(nodes)

            const min = nodes.reduce(function(prev, current) {
                    return (prev.weight < current.weight) ? prev : current
            })
            console.log(min.weight)
            const max = Math.max.apply(Math, nodes.map(function(o) {
                    return o.weight; 
            }))
            console.log(max)

            const x = d3.scaleLinear()
            .domain([min.weight, max])
            .range([3, 20])

            x.clamp(true)

            nodes.forEach(function(obj) {
                obj.weight = x(obj.weight)
            })


            // console.log('nodehash')
            // console.log(nodeHash)
            console.log('nodes')
            console.log(nodes)
            console.log('edges')
            console.log(edges)
            createForceNetwork(nodes, edges);
        }

        function createForceNetwork(nodes, edges) {

            //create a network from an edgelist
            const force = d3.forceSimulation(nodes)
            .force('link', d3.forceLink().links(edges))
            .force("forceX", d3.forceX().strength(.1).x(width * .5))
            .force("forceY", d3.forceY().strength(.1).y(height * .5))
            .force("center", d3.forceCenter().x(width * .5).y(height * .5))
            // .force('charge', d3.forceManyBody().strength(d => Math.min(-100, d.weight * -50)))
            .force('charge', d3.forceManyBody().strength(-3000))
            .on("tick", updateNetwork);

            // console.log(edges)
            svg.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke-width", "1px")
            .style("stroke", "#996666");

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
            .attr("fill", "#CC9999")
            .attr("stroke", "black")
            .attr("stroke-width", "1px")
            .attr("r", 5)

            nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            .style("stroke-width", "1px")
            .style("stroke-opacity", 0.75)
            .style("stroke", "white")
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
                .style("fill", "#CC9999");

                d3.selectAll("line")
                .style("stroke", "#996666")
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
                .style("stroke", "#66CCCC")
                .style("stroke-width", "2px");

                d3.selectAll("circle").filter(function (p) {return egoIDs.indexOf(p.id) > -1})
                .style("fill", "#66CCCC");
            }

            function updateNetwork() {
                svg.selectAll("line")
                .attr("x1", function (d) {return d.source.x})
                .attr("y1", function (d) {return d.source.y})
                .attr("x2", function (d) {return d.target.x})
                .attr("y2", function (d) {return d.target.y});

                svg.selectAll("g.node")
                .attr("transform", function (d) {return "translate(" + d.x + "," + d.y + ")"});

                svg.selectAll("g.node > circle")
                .attr("r", function (d) {return d.weight * 4}); //weiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiight

            }
        }
        // d3.csv(data).then(function(data) {createNetwork(data)});
        // d3.json(data).then(function(data) {createNetwork(data)});
        const data = require('./test.json');
        createNetwork(data)
    }, [data, width, height])
    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default HostComViz
