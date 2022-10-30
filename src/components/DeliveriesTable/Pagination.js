import React from "react";
import Button from 'react-bootstrap/Button';

const Pagination = ({ activePage, count, rowsPerPage, totalPages, setActivePage }) => {

    const beginning = activePage === 1 ? 1 : rowsPerPage * (activePage - 1) + 1
    const end = activePage === totalPages ? count : beginning + rowsPerPage - 1

    return (
        <>
            <div className="pagination">
                <Button variant="outline-secondary" disabled={activePage === 1} onClick={() => setActivePage(1)}>
                    ⏮️ First
                </Button>
                <Button variant="outline-secondary" disabled={activePage === 1} onClick={() => setActivePage(activePage - 1)}>
                    ⬅️ Previous
                </Button>
                <Button variant="outline-secondary" disabled={activePage === totalPages} onClick={() => setActivePage(activePage + 1)}>
                    Next ➡️
                </Button>
                <Button variant="outline-secondary" disabled={activePage === totalPages} onClick={() => setActivePage(totalPages)}>
                    Last ⏭️
                </Button>
            </div>
            <div className="main-heading">
                <p>
                    Page {activePage} of {totalPages}
                </p>
                <p>
                    Showing: {beginning === end ? end : `${beginning} - ${end}`} of {count}
                </p>
            </div>
        </>
    )
}

export default Pagination;