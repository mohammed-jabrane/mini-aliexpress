package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.security.OAuthFlow;
import io.swagger.v3.oas.models.security.OAuthFlows;
import io.swagger.v3.oas.models.security.Scopes;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Value("${spring.security.oauth2.resourceserver.jwt.issuer-uri}")
    private String issuerUri;

    @Bean
    public OpenAPI openAPI() {
        String authUrl = issuerUri + "/protocol/openid-connect/auth";
        String tokenUrl = issuerUri + "/protocol/openid-connect/token";

        return new OpenAPI()
                .info(new Info()
                        .title("Mini AliExpress API")
                        .description("Mini AliExpress Backend REST API")
                        .version("1.0.0"))
                .addSecurityItem(new SecurityRequirement().addList("oauth2"))
                .components(new Components()
                        .addSecuritySchemes("oauth2", new SecurityScheme()
                                .type(SecurityScheme.Type.OAUTH2)
                                .flows(new OAuthFlows()
                                        .authorizationCode(new OAuthFlow()
                                                .authorizationUrl(authUrl)
                                                .tokenUrl(tokenUrl)
                                                .scopes(new Scopes()
                                                        .addString("openid", "OpenID Connect"))))));
    }
}
