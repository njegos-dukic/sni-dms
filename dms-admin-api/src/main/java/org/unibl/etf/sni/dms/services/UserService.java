package org.unibl.etf.sni.dms.services;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.unibl.etf.sni.dms.models.entities.UserEntity;
import org.unibl.etf.sni.dms.repositories.UserRepository;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public List<UserEntity> getAll() { return userRepository.findAll(); }
    public UserEntity findByUsername(String username) {
        return userRepository.findById(username).orElse(null);
    }
    public UserEntity update(UserEntity userEntity) { return userRepository.saveAndFlush(userEntity); }
    // public void delete(UserEntity userEntity) { userRepository.delete(userEntity); }
    // public UserEntity create(UserEntity userEntity) { return userRepository.saveAndFlush(userEntity); }
}
