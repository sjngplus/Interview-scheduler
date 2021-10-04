import React, { useState, useEffect } from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";

export default function Application() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState((prev) => ({ ...prev, day: day }));

  useEffect(() => {
    Promise.all([
      axios.get("http://localhost:8001/api/days/"),
      axios.get("http://localhost:8001/api/appointments/"),
      axios.get("http://localhost:8001/api/interviewers/"),
    ]).then((all) => {
      const [daysResponse, appointmentsResponse, interviewersResponse] = all;
      // console.log(daysResponse.data);
      // console.log(appointmentsResponse.data);
      // console.log(interviewersResponse.data);
      setState((prev) => ({
        ...prev,
        days: daysResponse.data,
        appointments: appointmentsResponse.data,
        interviewers: interviewersResponse.data,
      }));
    });
  }, []);

  const editInterview = (id) => {};

  const cancelInterview = (id) => {
    const updatedAppointment = {
      ...state.appointments[id],
      interview: { ...state.appointments[id].interview },
    };
    const updatedAppointments = { ...state.appointments };
    updatedAppointments[id] = { ...updatedAppointment, interview: null };
    return axios
      .delete(`http://localhost:8001/api/appointments/${id}`)
      .then(() => setState((prev) => ({ ...prev, appointments: updatedAppointments })));
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = { ...state.appointments };
    appointments[id] = { ...appointment };
    return axios
      .put(`http://localhost:8001/api/appointments/${id}`, { interview })
      .then(() => setState((prev) => ({ ...prev, appointments: appointments })));
  };

  const dailyAppointments = getAppointmentsForDay(state, state.day);

  const interviewersForDay = getInterviewersForDay(state, state.day);

  const parsedAppointments = dailyAppointments.map((appointment) => {
    const parsedInterview = getInterview(state, appointment.interview);
    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={parsedInterview}
        interviewers={interviewersForDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
        editInterview={editInterview}
      />
    );
  });
  // console.log("State log:", state);
  return (
    <main className="layout">
      <section className="sidebar">
        <img className="sidebar--centered" src="images/logo.png" alt="Interview Scheduler" />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img className="sidebar__lhl sidebar--centered" src="images/lhl.png" alt="Lighthouse Labs" />
      </section>

      <section className="schedule">
        {parsedAppointments}
        <Appointment key="last" time="6pm" />
      </section>
    </main>
  );
}
