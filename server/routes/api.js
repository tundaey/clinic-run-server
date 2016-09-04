/**
 * Created by Tundaey on 4/6/2016.
 */
var controllers = require('../controllers');

module.exports = function(app, express){
    var apiRouter = express.Router();

    apiRouter.post('/clinics', controllers.clinicController.createClinic);
    apiRouter.post('/login', controllers.userController.login);
    apiRouter.use(controllers.userController.auth)
    apiRouter.post('/logout', controllers.userController.logOut);

    //users route
    apiRouter.post('/users', controllers.userController.register);
    apiRouter.get('/profile', controllers.userController.getProfile);
    apiRouter.get('/users', controllers.userController.getUsers);
    apiRouter.route('/users/:id')
        .get( controllers.userController.getUser)
        .put(controllers.userController.updateUser)
        .delete(controllers.userController.deleteUser);
    apiRouter.get('/doctors_online', controllers.userController.getOnlineDoctors)

    //medical record routes
    apiRouter.post('/records', controllers.recordController.createRecord);
    apiRouter.get('/records', controllers.recordController.getRecords);
    apiRouter.route('/records/:id')
        .get( controllers.recordController.getRecord)
    /*.put(controllers.userController.updateUser)
        .delete(controllers.userController.deleteUser);*/

    apiRouter.post('/appointments', controllers.appointmentController.createAppointment);
    apiRouter.get('/appointments', controllers.appointmentController.getAppointments);
    apiRouter.get('/appointments/pending/:id', controllers.appointmentController.getPendingAppointments);
    apiRouter.post('/appointments/send_vitals', controllers.appointmentController.sendVitals);
    apiRouter.get('/appointments/doctor', controllers.appointmentController.getDoctorAppointments);
    apiRouter.get('/appointments/:id', controllers.appointmentController.getAppointment);

    //ward routes
    apiRouter.post('/wards', controllers.wardController.createWard);
    apiRouter.get('/wards', controllers.wardController.getWards);
    apiRouter.get('/wards/beds', controllers.wardController.getWardAndBeds);
    apiRouter.get('/wards/:id', controllers.wardController.getWard);
    apiRouter.post('/wards/:id/bed', controllers.wardController.createBed);
    apiRouter.get('/beds/ward/:id', controllers.wardController.getBedInWard);

    //medical consults routes
    apiRouter.post('/consults', controllers.consultController.createConsult);
    apiRouter.get('/consults', controllers.consultController.getConsults);
    apiRouter.route('/consults/:id')
        .get( controllers.consultController.getConsult)
        .put(controllers.consultController.updateConsult)
        //.delete(controllers.userController.deleteUser);
    apiRouter.get('/consults/patient/:id', controllers.consultController.getPatientConsults);


    //laboratory routes
    apiRouter.post('/labs', controllers.labController.labRequest);
    apiRouter.get('/labs', controllers.labController.getLabs);
    apiRouter.get('/labs/requests', controllers.labController.getLabRequests);
    apiRouter.get('/labs/complete', controllers.labController.getLabComplete);
    apiRouter.route('/labs/:id')
        .get( controllers.labController.getLab)
        .put(controllers.labController.updateLab)
    //.delete(controllers.userController.deleteUser);

    apiRouter.get('/labs/patient/:id', controllers.labController.getPatientLabs);




    //radiology routes
    apiRouter.post('/imaging', controllers.imagingController.imagingRequest);
    apiRouter.get('/imaging', controllers.imagingController.getImagingRequests);
    apiRouter.get('/imaging/requests', controllers.imagingController.getPendingImagingRequests);
    apiRouter.get('/imaging/complete', controllers.imagingController.getCompleteImagingRequests);

    apiRouter.route('/imaging/:id')
        .get( controllers.imagingController.getImaging)
        .put(controllers.imagingController.updateImaging)
    //.delete(controllers.userController.deleteUser);

    apiRouter.get('/imaging/patient/:id', controllers.imagingController.getPatientImagingRequests);


    //pharmacy routes
    apiRouter.post('/pharmacy', controllers.pharmacyController.pharmacyRequest);
    apiRouter.get('/pharmacy', controllers.pharmacyController.getPrescriptions);
    apiRouter.get('/pharmacy/requests', controllers.pharmacyController.getPendingPrescriptionRequests);
    apiRouter.get('/pharmacy/complete', controllers.pharmacyController.getCompletePrescriptions);

    apiRouter.route('/pharmacy/:id')
        .get( controllers.pharmacyController.getPrescription)
        .put(controllers.pharmacyController.updatePrescription)
    //.delete(controllers.userController.deleteUser);

    apiRouter.get('/pharmacy/patient/:id', controllers.pharmacyController.getPatientPrescriptions);

    //admission routes
    apiRouter.post('/admissions', controllers.admissionController.admissionRequest);
    apiRouter.get('/admissions', controllers.admissionController.getAdmissions);
    apiRouter.get('/admissions/requests', controllers.admissionController.getPendingAdmissionRequests);
    apiRouter.get('/admissions/complete', controllers.admissionController.getAdmittedPatients);
    apiRouter.get('/admissions/pending/:id', controllers.admissionController.getPendingAdmissionRequests);
    apiRouter.get('/admissions/current/:id', controllers.admissionController.getCurrentAdmissionRequests);
    apiRouter.post('/admissions/admit', controllers.admissionController.admitPatient);
    apiRouter.post('/admissions/observationChart', controllers.admissionController.createObservationChart);
    apiRouter.get('/admissions/observationChart/:admission_id', controllers.admissionController.getObservationChart);
    apiRouter.post('/admissions/dailyReport', controllers.admissionController.createDailyReport);
    apiRouter.get('/admissions/dailyReport/:admission_id', controllers.admissionController.getDailyReport);
    apiRouter.post('/admissions/treatmentChart', controllers.admissionController.createTreatmentChart);
    apiRouter.get('/admissions/treatmentChart/:admission_id', controllers.admissionController.getTreatmentChart);
    apiRouter.post('/admissions/carePlan', controllers.admissionController.createCarePlan);
    apiRouter.get('/admissions/carePlan/:admission_id', controllers.admissionController.getCarePlan);
    apiRouter.post('/admissions/wardRound', controllers.admissionController.createWardRound);
    apiRouter.get('/admissions/wardRound/:admission_id', controllers.admissionController.getWardRound);


    apiRouter.route('/admissions/:id')
        .get( controllers.admissionController.getAdmission)
        //.put(controllers.admissionController.updatePrescription)
    //.delete(controllers.userController.deleteUser);


    apiRouter.get('/admissions/patient/:id', controllers.admissionController.getPatientAdmissions);

    apiRouter.get('/dashboard/doctor', controllers.dashboardController.doctorDashboard)

    return apiRouter;
}