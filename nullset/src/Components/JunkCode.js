// import { Link } from 'react-router-dom';
import { useRef, useEffect} from 'react';
import * as d3 from 'd3';

const HostComViz = ({ data }) => { // props
    // const [data, setData] = useState([25, 30, 40, 60, 20])
    // const [data, setData] = props
    const svgRef = useRef()

    // useEffect(() => {
    //     const svg = select(svgRef.current);
    //     svg
    //         .selectAll("circle")
    //         .data(data)
    //         .join(
    //             enter => enter.append("circle"), 
    //             update => update.attr("class", "updated"),
    //             exit => exit.remove()
    //         )
    //         .attr("r", value => value)
    //         .attr("cx", value => value *2)
    //         .attr("cy", value => value *2)
    //         .attr("stroke", "red");
    // }, [data])

    // return (
    //     <svg ref={svgRef}></svg>
    // );

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const createNetwork = (edgelist) => {
            const nodeHash = {};
            const nodes = [];
            const edges = [];

            edgelist.forEach((edge) => {
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

            svg.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke-width", "1px")
            .style("stroke", "#996666");

            var nodeEnter = svg.selectAll("g.node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("click", nodeClick)
            .on("dblclick", nodeDoubleClick)
            .on("mouseover", nodeOver)
            .on("mouseout", nodeOut);
            // .call(force.drag());

            nodeEnter.append("circle")
            .attr("r", 5)
            .style("fill", "#CC9999")
            .style("stroke", "black")
            .style("stroke-width", "1px")

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
        createNetwork(data)
    }, [data])
    return (
        <svg ref={svgRef}></svg>
    );
}

export default HostComViz
// import { Link } from 'react-router-dom';
import { useRef, useEffect} from 'react';
import * as d3 from 'd3';

const HostComViz = ({ data }) => { // props
    // const [data, setData] = useState([25, 30, 40, 60, 20])
    // const [data, setData] = props
    const svgRef = useRef()

    // useEffect(() => {
    //     const svg = select(svgRef.current);
    //     svg
    //         .selectAll("circle")
    //         .data(data)
    //         .join(
    //             enter => enter.append("circle"), 
    //             update => update.attr("class", "updated"),
    //             exit => exit.remove()
    //         )
    //         .attr("r", value => value)
    //         .attr("cx", value => value *2)
    //         .attr("cy", value => value *2)
    //         .attr("stroke", "red");
    // }, [data])

    // return (
    //     <svg ref={svgRef}></svg>
    // );

    useEffect(() => {
        const svg = d3.select(svgRef.current)
        const createNetwork = (edgelist) => {
            const nodeHash = {};
            const nodes = [];
            const edges = [];

            edgelist.forEach((edge) => {
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

            svg.selectAll("line")
            .data(edges)
            .enter()
            .append("line")
            .style("stroke-width", "1px")
            .style("stroke", "#996666");

            var nodeEnter = svg.selectAll("g.node")
            .data(nodes)
            .enter()
            .append("g")
            .attr("class", "node")
            .on("click", nodeClick)
            .on("dblclick", nodeDoubleClick)
            .on("mouseover", nodeOver)
            .on("mouseout", nodeOut);
            // .call(force.drag());

            nodeEnter.append("circle")
            .attr("r", 5)
            .style("fill", "#CC9999")
            .style("stroke", "black")
            .style("stroke-width", "1px")

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
        createNetwork(data)
    }, [data])
    return (
        <svg ref={svgRef}></svg>
    );
}

export default HostComViz
