package ma.mohammedjabrane.mini_aliexpress_backend.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public record ProductResponseDTO(
        UUID id,
        String name,
        String description,
        BigDecimal price,
        int stock,
        UUID categoryId,
        UUID sellerId,
        List<String> images,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {
}
