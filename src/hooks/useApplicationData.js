import { useState, useEffect } from "react";
import axios from "axios";
import { getAppointmentsForDay } from "../helpers/selectors";

export default function useApplicationData() {
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

  const updateSpotforDay = (currentState, selectedDay) => {
    const dayObj = currentState.days.find((element) => element.name === selectedDay);
    const dayObjId = currentState.days.findIndex((element) => element.name === selectedDay);
    const appointmentsArray = getAppointmentsForDay(currentState, selectedDay);
    const numOfSpots = appointmentsArray.filter((element) => element.interview === null).length;
    const newDay = { ...dayObj, spots: numOfSpots };
    const newDays = [...currentState.days];
    newDays[dayObjId] = { ...newDay };
    setState((prev) => ({ ...prev, days: newDays }));
  };

  useEffect(() => {
    updateSpotforDay(state, state.day);
  }, [state.appointments]);

  const cancelInterview = (id) => {
    const updatedAppointment = {
      ...state.appointments[id],
      interview: { ...state.appointments[id].interview },
    };
    const updatedAppointments = { ...state.appointments };
    updatedAppointments[id] = { ...updatedAppointment, interview: null };
    return axios.delete(`http://localhost:8001/api/appointments/${id}`).then(() => {
      setState((prev) => ({ ...prev, appointments: updatedAppointments }));
    });
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = { ...state.appointments };
    appointments[id] = { ...appointment };
    return axios.put(`http://localhost:8001/api/appointments/${id}`, { interview }).then(() => {
      setState((prev) => ({ ...prev, appointments: appointments }));
    });
  };

  // console.log(state);
  return { state, setDay, bookInterview, cancelInterview };
}
