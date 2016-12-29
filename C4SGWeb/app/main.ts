import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
import "materialize-css";
import "angular2-materialize";

const platform = platformBrowserDynamic();
platform.bootstrapModule(AppModule);
