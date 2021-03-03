// import { Link } from 'react-router-dom';
import { useRef, useEffect, useState} from 'react';
import * as d3 from 'd3';
import useResizeObserver from './ResizeObserver.js'

// const HostComViz = () => { // props
//     const [data, setData] = useState([25, 30, 40, 60, 20])
//     // const [data, setData] = props
//     const svgRef = useRef()

//     useEffect(() => {
//         const svg = d3.select(svgRef.current);
//         svg
//             .selectAll("circle")
//             .data(data)
//             .join(
//                 enter => enter.append("circle"), 
//                 update => update.attr("class", "updated"),
//                 exit => exit.remove()
//             )
//             .attr("r", value => value)
//             .attr("cx", value => value *2)
//             .attr("cy", value => value *2)
//             .attr("stroke", "red");
//     }, [data])

//     return (
//         <svg ref={svgRef}></svg>
//     );


const HostComViz = ({ data }) => {
    const svgRef = useRef()
    const wrapperRef = useRef();
    const dimensions = useResizeObserver(wrapperRef);

    useEffect(() => {
        if (!dimensions) return;
        const svg = d3.select(svgRef.current)
        svg.attr("viewBox", [
            -dimensions.width / 2,
            -dimensions.height / 2,
            dimensions.width,
            dimensions.height
        ]);

        const createNetwork = (edgeList) => {
            const nodeHash = {};
            const nodes = [];
            const edges = [];
            console.log('jsssss')

            Array.prototype.forEach.call(edgeList, (edge) => {
                if (!nodeHash[edge.source]) {
                    nodeHash[edge.source] = {id: edge.source, label: edge.source};
                    nodes.push(nodeHash[edge.source]);
                }
                if (!nodeHash[edge.target]) {
                    nodeHash[edge.target] = {id: edge.target, label: edge.target};
                    nodes.push(nodeHash[edge.target]);
                }
                if (edge.weight >= 5) {
                    edges.push({source: nodeHash[edge.source], target: nodeHash[edge.target], weight: edge.weight});
                }
            });
            createForceNetwork(nodes, edges);
        }

        function createForceNetwork(nodes, edges) {

            //create a network from an edgelist
            const force = d3.forceSimulation(nodes)
            .force('link', d3.forceLink().links(edges))
            // .size([500,500])
            .force('charge', function (d) {return Math.min(-100, d.weight * -50)})
            // .charge(function (d) {return Math.min(-100, d.weight * -50)})
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
            .on("dblclick", nodeDoubleClick)
            .on("mouseover", nodeOver)
            .on("mouseout", nodeOut);
            // .call(force.drag());

            nodeEnter.enter().append("circle")
            .attr("fill", "#CC9999")
            .attr("stroke", "black")
            .attr("stroke-width", "2px")
            .attr("r", 10)

            nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            .style("stroke-width", "1px")
            .style("stroke-opacity", 0.75)
            .style("stroke", "white")
            .style("font-size", "8px")
            .text(function (d) {return d.id})
            .style("pointer-events", "none")

            nodeEnter.append("text")
            .style("text-anchor", "middle")
            .attr("y", 2)
            .style("font-size", "8px")
            .text(function (d) {return d.id})
            .style("pointer-events", "none")

            function nodeClick(d) {
                d.fixed = true;
            }

            function nodeDoubleClick(d) {
                d.fixed = false;
            }

            function nodeOver(d) {
                force.stop();
                highlightEgoNetwork(d);
            }

            function nodeOut() {
                force.start();
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
                .attr("r", function (d) {return d.weight});

            }
        }
        d3.csv(data).then(function(ddata) {createNetwork(ddata)});
    }, [data])
    return (
        <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
            <svg ref={svgRef}></svg>
        </div>
    );
}

export default HostComViz
