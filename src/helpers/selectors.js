export function getAppointmentsForDay(state, day) {
  let dayAppointmentsId = [];
  for (const dayObj of state.days) {
    if (dayObj.name === day) dayAppointmentsId = [...dayObj.appointments];    
  }
  
  let appointmentsArray = [];
  for (const appointmentId of dayAppointmentsId) {
    appointmentsArray.push(state.appointments[appointmentId]);
  }
  
  console.log(appointmentsArray);
  return appointmentsArray;
};
