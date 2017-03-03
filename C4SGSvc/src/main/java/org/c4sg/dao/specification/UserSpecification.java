package org.c4sg.dao.specification;

import org.c4sg.entity.User;
import org.springframework.data.jpa.domain.Specification;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Created by vitalish on 2/28/17.
 */
public class UserSpecification implements Specification<User> {

    private Map<String, Object> conditions;

    public UserSpecification(Map<String, Object> conditions) {
        this.conditions = conditions;
    }

    @Override
    public Predicate toPredicate(Root<User> root, CriteriaQuery<?> criteriaQuery, CriteriaBuilder cb) {
        Predicate resultPredicate = null;
        List<Predicate> predicates = buildPredicates(root, cb);
        if (!predicates.isEmpty()) {
            resultPredicate = cb.and(predicates.toArray(new Predicate[predicates.size()]));
        }

        return resultPredicate;
    }

    private List<Predicate> buildPredicates(Root<User> root, CriteriaBuilder cb) {
        List<Predicate> predicates = new ArrayList<>();
        conditions.forEach((k, v) -> {
            if (Optional.ofNullable(v).isPresent()) {
                predicates.add(cb.like(root.get(k), "%" + String.valueOf(v.toString()) + "%"));
            }
        });
        return predicates;
    }
}
