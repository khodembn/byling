import { useEffect, useState } from "react";

import { getResidents } from "../../api/userApi";

import "../../styles/Residents.css";

export default function Residents() {

    const [residents, setResidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function fetchResidents() {

            try {

                const data =
                    await getResidents();

                setResidents(data);

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }

        }

        fetchResidents();

    }, []);

    if (loading) {
        return <h2>در حال بارگذاری...</h2>;
    }

    return (

        <div className="residents-page">

            <div className="page-header">

                <h1>ساکنین ساختمان</h1>

                <span>
                    تعداد ساکنین: {residents.length}
                </span>

            </div>

            <div className="table-card">

                <table className="resident-table">

                    <thead>

                        <tr>

                            <th>نام</th>

                            <th>طبقه</th>

                            <th>واحد</th>

                            <th>شماره موبایل</th>

                        </tr>

                    </thead>

                    <tbody>

                        {residents.map((resident) => (

                            <tr key={resident.userId}>

                                <td>{resident.fullName}</td>

                                <td>{resident.floorNumber}</td>

                                <td>{resident.unitNumber}</td>

                                <td>{resident.mobile}</td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>

    );

}