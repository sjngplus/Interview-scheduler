import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import { getAppointmentsForDay } from "../helpers/selectors";

// //Mock appointments data
// const appointments = [
//   {
//     id: 1,
//     time: "10am",
//     interview: {
//       student: "Fly McFly",
//       interviewer: {
//         id: 1,
//         name: "Tori Malcolm",
//         avatar: "https://i.imgur.com/Nmx0Qxo.png",
//       }
//     }
//   },
//   {
//     id: 2,
//     time: "12pm",
//   },
//   {
//     id: 3,
//     time: "1pm",
//     interview: {
//       student: "Lydia Miller-Jones",
//       interviewer: {
//         id: 1,
//         name: "Sylvia Palmer",
//         avatar: "https://i.imgur.com/LpaY82x.png",
//       }
//     }
//   },
//   {
//     id: 4,
//     time: "3pm",
//   },  
//   {
//     id: 5,
//     time: "5pm",
//     interview: {
//       student: "April May",
//       interviewer: {
//         id: 1,
//         name: "Sven Jones",
//         avatar: "https://i.imgur.com/twYrpay.jpg",
//       }
//     }
//   }
// ];


export default function Application() { 

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });
  const setDay = day => setState(prev => ({...prev, day: day}));
  
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days/"),
      axios.get("http://localhost:8001/api/appointments/")
    ]).then((all) => {
      const [daysResponse, appointmentsResponse] = all;
      console.log(daysResponse.data);
      console.log(appointmentsResponse.data);
      setState((prev) => ({...prev, days:daysResponse.data, appointments:appointmentsResponse.data}));
    });
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  const parsedAppointments = dailyAppointments.map((appointment) => {
    return <Appointment key={appointment.id} {...appointment}/>
  });

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      
      <section className="schedule">
        {parsedAppointments}
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
