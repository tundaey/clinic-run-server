/**
 * Created by Tundaey on 4/6/2016.
 */
var userController = require('./users/userController');
var recordController = require('./records/recordController');
var clinicController = require('./clinics/clinicController');
var appointmentController = require('./appointments/appointmentController');
var consultController = require('./consults/consultController');
var labController = require('./labs/labController');
var imagingController = require('./imaging/imagingController');
var pharmacyController = require('./pharmacy/pharmacyController');
var admissionController = require('./admission/admissionController');
var wardController = require('./ward/wardController');
var dashboardController = require('./dashboard/dashboardController');

module.exports = {
    userController: userController,
    recordController : recordController,
    clinicController : clinicController,
    appointmentController : appointmentController,
    consultController : consultController,
    labController : labController,
    imagingController : imagingController,
    pharmacyController : pharmacyController,
    admissionController : admissionController,
    dashboardController : dashboardController,
    wardController : wardController
}