import { CircleProgressOptions } from 'ng-circle-progress';

export const circleProgressOptions: Partial<CircleProgressOptions> = {
  radius: 45,
  outerStrokeWidth: 10,
  innerStrokeWidth: 6,
  outerStrokeColor: 'var(--primary-color)',
  innerStrokeColor: 'var(--input-color)',
  animation: true,
  animationDuration: 300,
  showTitle: false,
  showUnits: false,
  showSubtitle: false,
  showBackground: false,
  startFromZero: false,
};
