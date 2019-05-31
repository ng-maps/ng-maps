/*
 * Public API Surface of core
 */

// main modules
export * from './lib/directives';
export * from './lib/services';

// core module
// we explicitly export the module here to prevent this Ionic 2 bug:
// http://stevemichelotti.com/integrate-angular-2-google-maps-into-ionic-2/
export {NgMapsCoreModule} from './lib/core.module';

