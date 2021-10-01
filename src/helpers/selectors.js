export function getAppointmentsForDay(state, day) {
  let dayAppointmentsId = [];
  for (const dayObj of state.days) {
    if (dayObj.name === day) dayAppointmentsId = [...dayObj.appointments];    
  }
  
  let appointmentsArray = [];
  for (const appointmentId of dayAppointmentsId) {
    appointmentsArray.push(state.appointments[appointmentId]);
  }
  
  return appointmentsArray;
};


export function getInterview(state, interview) {
  if (!interview) return null;
  const interviewerId = interview.interviewer
  const result = {
    student: interview.student,
    interviewer: {
      ...state.interviewers[interviewerId]
    }
  };
  return result;
};