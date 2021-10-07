import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  // useEffect(() => {
  //   const webSocket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);
  //   webSocket.onopen = (event) => webSocket.send("ping");
  //   webSocket.onmessage = (event) => console.log(JSON.parse(event.data));
  // }, []);

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });
  const setDay = (day) => setState((prev) => ({ ...prev, day: day }));

  useEffect(() => {
    Promise.all([axios.get("/api/days/"), axios.get("/api/appointments/"), axios.get("/api/interviewers/")]).then((all) => {
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

  const updateSpotforDay = (currentState, selectedDay, updatedAppts) => {
    const dayObj = currentState.days.find((element) => element.name === selectedDay);
    const dayObjId = currentState.days.findIndex((element) => element.name === selectedDay);

    let dayAppointmentsId = [];
    for (const dayObj of state.days) {
      if (dayObj.name === selectedDay) dayAppointmentsId = [...dayObj.appointments];
    }

    const appointmentsArray = [];
    for (const appointmentId of dayAppointmentsId) {
      appointmentsArray.push(updatedAppts[appointmentId]);
    }

    const numOfSpots = appointmentsArray.filter((element) => element.interview === null).length;
    const newDay = { ...dayObj, spots: numOfSpots };
    const newDays = [...currentState.days];
    newDays[dayObjId] = { ...newDay };
    setState((prev) => ({ ...prev, days: newDays, appointments: updatedAppts }));
  };

  const cancelInterview = (id) => {
    const updatedAppointment = {
      ...state.appointments[id],
      interview: { ...state.appointments[id].interview },
    };
    const updatedAppointments = { ...state.appointments };
    updatedAppointments[id] = { ...updatedAppointment, interview: null };
    return axios.delete(`/api/appointments/${id}`).then(() => {
      updateSpotforDay(state, state.day, updatedAppointments);
    });
  };

  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };
    const appointments = { ...state.appointments };
    appointments[id] = { ...appointment };
    return axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      updateSpotforDay(state, state.day, appointments);
    });
  };

  return { state, setDay, bookInterview, cancelInterview };
}
