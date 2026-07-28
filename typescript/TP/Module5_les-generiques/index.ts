function myFunction<Type>(param: Type): void {
    console.log(param);
}

myFunction<string>("Hello, TypeScript!");
myFunction<number>(42);
myFunction<boolean>(true);