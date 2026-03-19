import { studentIcon } from "../components/icons";

import { useEffect, useState } from "react";
import "../registerStudent.scss"
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import PortalNav from '../components/PortalNav'

interface Student {
  firstName: string;
  lastName: string;
  id: string | number;
  gender: string;
  suspended: boolean;
  paymentStatus: boolean;
  timeStamp: number;
  level: number;
  fees: number;
  age: number;
  address: string;
}

const RegisterStudent: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [errData, setErrData] = useState<Record<string, string>>({});
  const [buttonStatus, setButtonStatus] = useState<boolean>(true);
  const [student, setStudent] = useState<Student>({
    firstName: "",
    lastName: "",
    id: "",
    gender: "",
    suspended: false,
    paymentStatus: false,
    timeStamp: Date.now(),
    level: 0,
    fees: 0,
    age: 0,
    address: "",
  });

  const studentsData: Student[] = localStorage.getItem("studentsData")
    ? JSON.parse(localStorage.getItem("studentsData") as string)
    : [];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const value = e.target.value;
    setStudent({ ...student, [e.target.name]: value });
  };
  // const resetFormValues = () => {
  //     setTitle("");
  //     setDesc("");
  //   };
  const handleAddStudent = (e?: React.FormEvent | React.MouseEvent): void => {
    if (e) e.preventDefault();
    const newErr: Record<string, string> = {};
    if (!student.firstName || !student.lastName || !student.level || !student.gender) {
      toast.error("Kindly input correct details");
      newErr.title = "Kindly input your event's title";
      return;
    }
    student.id = studentsData.length + 1;
    studentsData.push(student);
    setButtonStatus(true);
    localStorage.setItem("studentsData", JSON.stringify(studentsData));
    console.log("added");
    toast.success("Student added successfully! 🎉");
    student.firstName = "";
    student.lastName = "";
    student.gender = "";
    student.level = 0;
    // window.location.href = "/";
    console.log(`Added ${student.firstName}`);
  };

  const level: number[] = [100, 200, 300, 400];

  return (
    <>
      <section className="container">
        <div className="sideBar">
          <PortalNav />
        </div>
        <div className="main">
          <section className="header">
            <h1>Student Registry</h1>
            <div className="headerBtn">
              <p>The central ledger of academic standing, financial compliance, and institutional identity for the current session.</p>
              <div style={!buttonStatus ? { display: "none" } : { display: "block" }}>
                {/* <img src={studentIcon} alt="" /> */}
                <input
                  className="submit-btn" type="submit"
                  onClick={() => setButtonStatus(false)} value={"+Add student"}
                  onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                />
              </div>
            </div>

            <form style={buttonStatus ? { display: "none" } : { display: "block" }}
              action=""
              onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                handleAddStudent();
              }}
            >
              <div className="addStudent">
                <div className="inputGroup">
                  <label htmlFor="firstName">First name</label>
                  <input type="text" name="firstName" id="" value={student.firstName}
                    onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                  />
                </div>
                <div className="inputGroup">
                  <label htmlFor="lastName">Last name</label>
                  <input type="text" name="lastName" value={student.lastName}
                    onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}

                  />
                </div>
                <div className="inputGroup">
                  <label htmlFor="age">Age</label>
                  <input type="number" name="age" id="" value={student.age}
                    onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                  />
                </div>
                <div className="select">
                  <select value={student.gender} name='gender' onChange={handleChange}>Gender
                    <option value="">-- Gender -- </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <select value={student.level} name='level' onChange={handleChange}>
                    <option value="">-- Level --</option>
                    {level.map((level: number, index: number) => (
                      <option key={index} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {/* add student button */}
              <div className="headerBtn">
                {/* <img src={studentIcon} alt="" /> */}
                <input
                  className="submit-btn" type="submit"
                  onClick={handleAddStudent} value={"+Add student"}
                  onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}
                />
              </div>
            </form>


          </section>

          {/* search */}
          <section className="search-cont">
            <div className="search">
              <input type="text" value="" placeholder="search by name, level, or address"
                onChange={handleChange as React.ChangeEventHandler<HTMLInputElement>}

              />
              <span>Level</span>
              <span>Payment status</span>
            </div>
          </section>

          <section className="displayStudent">
            <div className="title">
              <span className="title1">Student</span>
              <span>Id / Level</span>
              <span>Age</span>
              <span>Wallet Add.</span>
              <span>Status</span>
              <span>Actions</span>
            </div>
            <div className="details">
              {studentsData && studentsData.map((student) => (
                < >
                  <div key={student.id} className="student">
                    <div className="about">
                      <img src="" alt="" />
                      <div className="det">
                        <p>{student.lastName + " " + student.firstName}</p>
                        <p>{student.lastName + student.id}@web3bridge.edu.org</p>
                      </div>

                    </div>
                    <div className="id">
                      <p>#{student.id}</p>
                      <p>{student.level}</p>
                    </div>
                    <div>
                                          <span>{student.age}</span>

                    </div>
                    <div>
                                          <span>address</span>

                    </div>
<div>
                      <span className="status" style={student.paymentStatus ? { backgroundColor: "#c7fcc0", color: "green" } : { backgroundColor: "#fda9a9", color: "#470303" }}>{student.paymentStatus ? "Paid" : "Not paid"}</span>
</div>                    <div>
                      <b>.</b>
                      <b>.</b>
                      <b>.</b>

                    </div>
                  </div>
                </>
              ))}

            </div>

            <div className="footer">
              <p>Showing {studentsData.length} of {studentsData.length} students</p>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}

export default RegisterStudent;
