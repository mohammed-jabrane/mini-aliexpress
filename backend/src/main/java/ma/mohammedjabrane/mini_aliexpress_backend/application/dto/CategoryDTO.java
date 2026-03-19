package ma.mohammedjabrane.mini_aliexpress_backend.application.dto;

import java.util.List;
import java.util.UUID;

public record CategoryDTO(
        UUID id,
        String name,
        UUID parentId,
        List<CategoryDTO> children
) {
}
