package ma.mohammedjabrane.mini_aliexpress_backend.application.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public record ProductRequestDTO(
        String name,
        String description,
        BigDecimal price,
        int stock,
        UUID categoryId,
        List<String> images
) {
}
