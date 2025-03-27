FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 7197

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["UnderGroundArchive_Backend.csproj", "./"]
RUN dotnet restore "./UnderGroundArchive_Backend.csproj"
COPY . .
RUN dotnet publish "./UnderGroundArchive_Backend.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .

ENV ASPNETCORE_URLS=http://+:7197

ENTRYPOINT ["dotnet", "UnderGroundArchive_Backend.dll"]
