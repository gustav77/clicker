export class Numerical {

 public static EPSILON: number = 1e-12;
 public static MACHINE_EPSILON: number = 1.12e-16;

 public static TOLERANCE: number = 1e-6;
 public static CURVETIME_EPSILON: number = 4e-7;
 public static GEOMETRIC_EPSILON: number = 2e-7;
 public static WINDING_EPSILON: number = 2e-7;
 public static TRIGONOMETRIC_EPSILON: number = 1e-7;
 public static CLIPPING_EPSILON: number = 1e-7;

 public static isZero(val: number): boolean {
  return val >= -this.EPSILON && val <= this.EPSILON;
 }

};
