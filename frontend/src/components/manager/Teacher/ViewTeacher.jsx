import React, { useEffect, useState } from "react";
import axios from "axios";

const ViewTeacher = () => {
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        const fetchTeachers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/viewteachers/teachers");
                setTeachers(response.data);
            } catch (error) {
                console.error("Error fetching teachers:", error);
            }
        };

        fetchTeachers();
    }, []);

    return (
        <div>
            <h2>Teacher Details</h2>
            {teachers.map((teacher) => (
                <div key={teacher._id} style={{ border: "1px solid #ccc", padding: "20px", marginBottom: "20px" }}>
                    <h3>{teacher.firstname} {teacher.lastname}</h3>
                    <p><strong>Email:</strong> {teacher.email}</p>
                    <p><strong>Phone:</strong> {teacher.phone}</p>
                    <p><strong>Alternate Phone:</strong> {teacher.altPhone}</p>
                    <p><strong>Gender:</strong> {teacher.gender}</p>
                    <p><strong>Address:</strong> {teacher.address}</p>
                    <p><strong>Subjects:</strong> {teacher.subjects}</p>
                    <p><strong>Date of Birth:</strong> {new Date(teacher.dateofbirth).toLocaleDateString()}</p>
                    <p><strong>Qualification:</strong> {teacher.qualification}</p>
                    <p><strong>Specialization:</strong> {teacher.specialization}</p>
                    <p><strong>Experience:</strong> {teacher.experience}</p>
                    <p><strong>ID Card:</strong> <a href={teacher.idCard} target="_blank" rel="noopener noreferrer">View</a></p>
                    <p><strong>Photo:</strong> <img src={teacher.photo} alt="Teacher" style={{ width: "100px", height: "100px" }} /></p>
                    <p><strong>Degree Certificate:</strong> <a href={teacher.degreeCertificate} target="_blank" rel="noopener noreferrer">View</a></p>
                    <p><strong>Experience Certificate:</strong> <a href={teacher.experienceCertificate} target="_blank" rel="noopener noreferrer">View</a></p>
                    <p><strong>Resume:</strong> <a href={teacher.resume} target="_blank" rel="noopener noreferrer">View</a></p>
                </div>
            ))}
        </div>
    );
};

export default ViewTeacher;
