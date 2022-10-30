import React, { useEffect, useState } from "react";
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import driverData from '../../data/drivers.json'
import hotelData from '../../data/hotels.json'
import tripsData from '../../data/trips.json'
import Pagination from "./Pagination";

const Deliveries = () => {
    // Table data
    const [drivers, setDrivers] = useState([]);
    const [hotels, setHotels] = useState([]);
    const [deliveries, setDeliveries] = useState([]);

    useEffect(() => {
        setDrivers(driverData);
        setHotels(hotelData);
        setDeliveries(tripsData);
    }, [drivers, hotels, deliveries])

    let driverDeliveries = deliveries.map(item => ({
        ...drivers.find(({ uuid }) => item.driver_id === uuid),
        ...item
    }));

    let fullDataset = driverDeliveries.map(item => ({
        ...hotels.find(({ uuid }) => item.hotel_id === uuid),
        ...item
    }));

    fullDataset.forEach(data => {
        const start_date = new Date(data.start_time);
        const deliv_date = new Date(data.delivery_time);
        data.start_date_standard = new Date(start_date.getTime() - (start_date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        data.delivery_date_standard = new Date(deliv_date.getTime() - (deliv_date.getTimezoneOffset() * 60000)).toISOString().split("T")[0];
        const fullName = data.first_name + ' ' + data.last_name;
        data.driver_name = fullName;

    })

    console.log('mzima', fullDataset);

    const columns = [
        { accessor: 'driver_name', label: 'Driver Name' },
        { accessor: 'name', label: 'Hotel Name' },
        { accessor: 'rating', label: 'Rating' },
        { accessor: 'start_date_standard', label: 'Start Time' },
        { accessor: 'delivery_date_standard', label: 'End Time' }
    ]

    // Pagination & Filters
    const filterRows = (rows, filters) => {
        if (filters === '') return rows;

        return rows.filter(row => {
            // console.log(Object.keys(filters));
            return Object.keys(filters).every(accessor => {
                const value = row[accessor]
                // console.log("v: " + value, typeof value);
                const searchValue = filters[accessor]
                // console.log("sV: " + searchValue, typeof searchValue)

                if (typeof value === 'string') {
                    console.log("naona string")
                    return value.toLowerCase().includes(searchValue.toLowerCase())
                }

                if (typeof value === 'boolean') {
                    return (searchValue === 'true' && value) || (searchValue === 'false' && !value)
                }

                if (typeof value === 'number') {
                    console.log("naona no")
                    let sValue = Number(searchValue)
                    return value === sValue
                }

                return false;
            })
        })
    }


    const handleSearch = (value, accessor) => {
        setActivePage(1)

        // console.log('nafikiwa')
        if (value) {
            setFilters(prevFilters => ({
                ...prevFilters,
                [accessor]: value,
            }))
        } else {
            setFilters(prevFilters => {
                const updatedFilters = { ...prevFilters }
                delete updatedFilters[accessor]

                return updatedFilters
            })
        }
    }

    const [activePage, setActivePage] = useState(1);
    const [filters, setFilters] = useState({});
    const rowsPerPage = 10;

    // console.log(filters)

    const filteredRows = filterRows(fullDataset, filters);
    console.log('filter', filteredRows)
    const calculatedRows = filteredRows.slice((activePage - 1) * rowsPerPage, activePage * rowsPerPage);

    const count = filteredRows.length;
    const totalPages = Math.ceil(count / rowsPerPage)

    return (
        <div className="container" id="MainTable">
            <div className="table-responsive">
                <h4 className="text-center">Deliveries Data</h4>
                <Table striped bordered hover size="sm" className="table">
                    <thead>
                        <tr>
                            {columns.map(col => {
                                return <th key={col.accessor}>{col.label}</th>
                            })}
                        </tr>
                        <tr>
                            {columns.map(col => {
                                return (
                                    <th>
                                        <Form.Control
                                            key={`${col.accessor}-search`}
                                            type="search"
                                            placeholder={`Search ${col.label}`}
                                            value={filters[col.accessor]}
                                            onChange={e => handleSearch(e.target.value, col.accessor)}
                                        />
                                    </th>
                                )
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {calculatedRows.map((trip, index) => (
                            <tr key={index}>
                                <td>{trip.first_name} {trip.last_name}</td>
                                <td>{trip.name}</td>
                                <td>{trip.rating}</td>
                                <td>{trip.start_date_standard}</td>
                                <td>{trip.delivery_date_standard}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                <Pagination
                    activePage={activePage}
                    count={count}
                    rowsPerPage={rowsPerPage}
                    totalPages={totalPages}
                    setActivePage={setActivePage}
                />
            </div>
        </div>
    )

}

export default Deliveries;