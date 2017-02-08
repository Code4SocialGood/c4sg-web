import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import "materialize-css";
import "angular2-materialize";
import "jquery";

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
