import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import { getAppointmentsForDay, getInterview } from "../helpers/selectors";


export default function Application() { 

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });
  const setDay = day => setState(prev => ({...prev, day: day}));
  
  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days/"),
      axios.get("http://localhost:8001/api/appointments/"),
      axios.get("http://localhost:8001/api/interviewers/")
    ]).then((all) => {
      const [daysResponse, appointmentsResponse, interviewersResponse] = all;
      console.log(daysResponse.data);
      console.log(appointmentsResponse.data);
      console.log(interviewersResponse.data);
      setState((prev) => ({...prev, days:daysResponse.data, appointments:appointmentsResponse.data, interviewers:interviewersResponse.data}));
    });
  }, []);

  const dailyAppointments = getAppointmentsForDay(state, state.day);
  
  const parsedAppointments = dailyAppointments.map((appointment) => {
    const parsedInterview = getInterview(state, appointment.interview)
    return (
      <Appointment 
        key={appointment.id} 
        id={appointment.id}
        time={appointment.time}
        interview={parsedInterview}
      />)
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
