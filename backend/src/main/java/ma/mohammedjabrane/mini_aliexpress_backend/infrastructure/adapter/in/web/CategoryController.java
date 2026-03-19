package ma.mohammedjabrane.mini_aliexpress_backend.infrastructure.adapter.in.web;

import lombok.RequiredArgsConstructor;
import ma.mohammedjabrane.mini_aliexpress_backend.application.dto.CategoryDTO;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.model.Category;
import ma.mohammedjabrane.mini_aliexpress_backend.domain.port.out.CategoryRepositoryPort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepositoryPort categoryRepository;

    @GetMapping
    public List<CategoryDTO> list() {
        return categoryRepository.findAll().stream()
                .map(c -> new CategoryDTO(c.getId(), c.getName(), c.getParentId(), List.of()))
                .toList();
    }

    @GetMapping("/tree")
    public List<CategoryDTO> tree() {
        List<Category> all = categoryRepository.findAll();

        Map<UUID, CategoryDTO> map = new LinkedHashMap<>();
        for (Category c : all) {
            map.put(c.getId(), new CategoryDTO(c.getId(), c.getName(), c.getParentId(), new ArrayList<>()));
        }

        List<CategoryDTO> roots = new ArrayList<>();
        for (CategoryDTO dto : map.values()) {
            if (dto.parentId() == null) {
                roots.add(dto);
            } else {
                CategoryDTO parent = map.get(dto.parentId());
                if (parent != null) {
                    parent.children().add(dto);
                }
            }
        }

        return roots;
    }
}
