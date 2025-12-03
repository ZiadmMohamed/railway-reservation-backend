// Jest mock for @thallesp/nestjs-better-auth
// This prevents ESM import errors during testing

export const AllowAnonymous = () => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    return descriptor || target;
  };
};
