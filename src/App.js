import './App.css';
import BarChart from './components/DeliveriesCharts/DeliveriesBarChart';
import Deliveries from './components/DeliveriesTable/DeliveriesTable';
import TopDriversChart from './components/TopDrivers/TopDriversChart';
import NavBar from './components/NavBar/NavBar';

const App = () => {
  return (
    <div>
      {/* <div className='main-heading text-center'>
        <div className='brand-logo'>
          <img src={logo} alt="brand-logo"/>
        </div>
        <div className='links'>
            <a href='#MainTable'>Main</a>
            <a href='#TopN'>Top N</a>
            <a href='#DeliveriesChart'>Deliveries Over Time</a>
        </div>
        <h1>Delivery Dashboard</h1>
      </div>
       */}
      <NavBar />
      <Deliveries />
      <TopDriversChart />
      <BarChart />
    </div>
  )
}

export default App;
