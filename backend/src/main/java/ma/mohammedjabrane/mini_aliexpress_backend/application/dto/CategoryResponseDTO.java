package ma.mohammedjabrane.mini_aliexpress_backend.application.dto;

import java.util.List;
import java.util.UUID;

public record CategoryResponseDTO(
        UUID id,
        String name,
        UUID parentId,
        List<CategoryResponseDTO> children
) {
}
