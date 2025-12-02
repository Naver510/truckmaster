import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { VehicleModule } from './vehicle/vehicle.module';
import { ReservationModule } from './reservation/reservation.module';
import { MaintenanceModule } from './maintenance/maintenance.module';

@Module({
  imports: [UserModule, VehicleModule, ReservationModule, MaintenanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
