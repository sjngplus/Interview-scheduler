import React from "react";
import "components/Application.scss";
import DayList from "./DayList";
import Appointment from "./Appointment/index";
import { getAppointmentsForDay, getInterview, getInterviewersForDay } from "../helpers/selectors";
import useApplicationData from "hooks/useApplicationData";

export default function Application() {
  const { state, setDay, bookInterview, cancelInterview } = useApplicationData();

  const interviewersForDay = getInterviewersForDay(state, state.day);

  const parsedAppointments = getAppointmentsForDay(state, state.day).map((appointment) => {
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
