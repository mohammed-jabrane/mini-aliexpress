package ma.mohammedjabrane.mini_aliexpress_backend.domain.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.UUID;

@Getter
@Builder
@AllArgsConstructor
public class Category {

    private UUID id;
    private String name;
    private UUID parentId;
}
