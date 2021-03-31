import React, {Component} from "react"
import "./LineChart.css"
class LineChart extends Component {
  // GET MAX & MIN X
  getMinX() {
    const {data} = this.props;
    return data[0].Time;
  }
  getMaxX() {
    const {data} = this.props;
    return data[data.length - 1].Time;
  }
  // GET MAX & MIN Y
  getMinY() {
    const {data} = this.props;
    return data[0].Length;
  }
  getMaxY() {
    const {data} = this.props;
    return data[data.length - 1].Length;
  }
  // GET SVG COORDINATES
  getSvgX(x) {
    const {svgWidth} = this.props;
    return (x / this.getMaxX() * svgWidth);
  }
  getSvgY(y) {
    const {svgHeight} = this.props;
    return svgHeight - (y / this.getMaxY() * svgHeight);
  }
  // BUILD SVG PATH
  makePath() {
    const {data, color} = this.props;
    return d3.line().x(d => x(data.Time)).y(d => y(data.Length));
    
    // let pathD = "M " + this.getSvgX(data[0].Time) + " " + this.getSvgY(data[0].Length) + " ";

    // pathD += new Map(point, i) => {
    //   return "L " + this.getSvgX(point.Time) + " " + this.getSvgY(point.Length) + " ";
    // });

    return (
      <path className="linechart_path" d={pathD} style={{stroke: color}} />
    );
  }
  // BUILD GRID AXIS
  makeAxis() {
  const minX = this.getMinX(), maxX = this.getMaxX();
  const minY = this.getMinY(), maxY = this.getMaxY();

  return (
    <g className="linechart_axis">
      <line
        x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
        x2={this.getSvgX(maxX)} y2={this.getSvgY(minY)} />
      <line
        x1={this.getSvgX(minX)} y1={this.getSvgY(minY)}
        x2={this.getSvgX(minX)} y2={this.getSvgY(maxY)} />
    </g>
    );
  }
  // RENDER & RETURN SVG PATH AND AXIS
  render() {
    const {svgHeight, svgWidth} = this.props;

    return (
      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
        {this.makePath()}
        {this.makeAxis()}
      </svg>
    );
  }
}
// DEFAULT PROPS
LineChart.defaultProps = {
  data: [],
  color: '#2196F3',
  svgHeight: 300,
  svgWidth: 700
}

export default LineChart;
