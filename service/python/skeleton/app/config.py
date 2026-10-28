from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "${{ values.componentId }}"
    environment: str = "development"
    debug: bool = False
    port: int = 8000

    model_config = SettingsConfigDict(
        env_prefix="APP_",
        env_file=".env",
        extra="ignore",
    )


settings = Settings()
