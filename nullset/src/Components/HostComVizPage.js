import HostComViz from './HostComViz';
import data from './data.csv'

const HostComVizPage = () => {
    return (
        <div>
            <HostComViz data={data} />
        </div>
    )
}

export default HostComVizPage


