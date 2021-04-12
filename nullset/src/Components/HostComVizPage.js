import HostComViz from './HostComViz';
import data from './data.csv'
// import * as data from './sshexample.json'

const HostComVizPage = () => {
    // const data = require('./sshexample.json');
    // console.log(data);
    return (
        <div>
            {/* <header> 
                <Navigation />
            </header>
            <SideBar dashboards={dashboards} /> */}
            {/* <HostComViz data={data} /> */}
            <HostComViz data={data} />

        </div>
    )
}

export default HostComVizPage


