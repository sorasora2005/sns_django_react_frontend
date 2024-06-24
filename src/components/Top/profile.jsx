import React, { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Avatar from '@mui/material/Avatar';
import { postCreateProfile, updateProfile, getProfileList, patchCheckProfile, deleteProfile } from "../../common/api/profile.js";
import axios from 'axios';


const ProfileComponent = () => {
    const [profileList, setProfileList] = useState([]);
    const [selectedProfile, setSelectedProfile] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newProfileName, setNewProfileName] = useState('');
    const [originalProfile, setOriginalProfile] = useState(null);
    const [changedFields, setChangedFields] = useState({});
    const newlyAddedProfileRef = useRef(null);

    useEffect(() => {
        getProfileList().then(profiles => {
            setProfileList(profiles);
        }).catch(error => {
            console.error('Failed to fetch profiles:', error);
        });
    }, []);

    const handleCheck = (e) => {
        e.preventDefault();
        const profileId = e.target.value;
        const checked = e.target.checked;
        const list = profileList.map(value => {
            if (value.id.toString() === profileId) {
                return { ...value, checked: checked };
            }
            return value;
        });
        setProfileList(list);
        patchCheckProfile(profileId, checked);
    };

    const handleEdit = (profile) => {
        setSelectedProfile(profile);
        setOriginalProfile(profile);
        setChangedFields({});
        setIsDialogOpen(true);
    };

    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setSelectedProfile(null);
    };

    const scrollToNewProfile = () => {
        if (newlyAddedProfileRef.current) {
            newlyAddedProfileRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    const handleDialogSave = () => {
        if (Object.keys(changedFields).length > 0) {
            updateProfile({ ...changedFields, id: selectedProfile.id });
            const list = profileList.map(profile => {
                if (profile.id === selectedProfile.id) {
                    return { ...profile, ...changedFields };
                }
                return profile;
            });
            setProfileList(list);
            setChangedFields({});
        }
        handleDialogClose();
    };
    
    

    const handleCreate = async () => {
        const newProfile = {
            name: newProfileName
        };
        if (!newProfileName.trim()) {
            alert('名前を入力してください');
        } else {
            postCreateProfile(newProfile)
            .then(createdProfile => {
                // APIからの応答をプロファイルリストに追加
                setProfileList(prevProfiles => [...prevProfiles, createdProfile]);
                setTimeout(() => {
                    scrollToNewProfile();
                }, 0);
                setNewProfileName(''); // 名前入力フィールドをリセット
            })
            .catch(error => {
                // エラー処理
                console.error('Failed to create profile:', error);
                alert('プロファイルの作成に失敗しました。'); // ユーザーにエラーを通知
            });
        };
    };
    

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedProfile(prevProfile => ({
            ...prevProfile,
            [name]: value
        }));
        if (originalProfile[name] !== value) {
            setChangedFields(prev => ({ ...prev, [name]: value }));
        } else {
            setChangedFields(prev => {
                const newState = { ...prev };
                delete newState[name];
                return newState;
            });
        }
    };
    

    const handleSetProfile = (e) => {
        setNewProfileName(e.target.value);
    };

    const handleImageChange = (event, profileId) => {
      const file = event.target.files[0];  // 選択されたファイルを取得
      if (file) {
          const formData = new FormData();
          formData.append('image', file);  // 'image'はバックエンドが期待するフィールド名に合わせてください
  
          // アップロード用のAPIエンドポイントへファイルをPOST
          axios.post(`http://localhost:8000/api/user_profile/${profileId}/update_image/`, formData, {
              headers: {
                  'Content-Type': 'multipart/form-data'
              }
          })
          .then(response => {
              // アップロードが成功した場合、レスポンスから新しい画像URLを取得し、プロファイルリストを更新
              const updatedImage = response.data.image;  // レスポンスに含まれる新しい画像のURL
              const updatedProfiles = profileList.map(profile => {
                  if (profile.id === profileId) {
                      return { ...profile, image: updatedImage };
                  }
                  return profile;
              });
              setProfileList(updatedProfiles);
              alert('Image updated successfully!');
              console.log(`${updatedImage}`)
          })
          .catch(error => {
              console.error('Error uploading image:', error);
              alert('Failed to upload image.');
          });
      }
  };
  

    const handleDelete = (e) => {
        const profileId = e.currentTarget.getAttribute('data-id');
        deleteProfile(profileId)
            .then(data => {
                console.log('Profile deleted successfully', data);
                const updatedProfiles = profileList.filter(profile => Number(profile.id) !== Number(profileId));
                setProfileList(updatedProfiles);
            })
            .catch(error => {
                console.error('Failed to delete the profile:', error);
            });
    };

    return (
        <Container maxWidth="xs">
            <Box display="flex" justifyContent="space-between" mt={4} mb={4}>
                <TextField label="名前" variant="outlined" size="small" onChange={handleSetProfile} />
                <Button variant="contained" color="primary" onClick={handleCreate}>作成</Button>
            </Box>
            <FormGroup>
                {profileList.map((profile) => (
                    <Box key={profile.id} display="flex" justifyContent="space-between" alignItems="center" mb={1}
                    ref={profile.id === profileList[profileList.length - 1].id ? newlyAddedProfileRef : null}>
                        <Box flexGrow={1} mr={2}>
                            <FormControlLabel
                                control={<Checkbox value={profile.id} onChange={handleCheck} checked={profile.checked || false} />}
                                label={<span onClick={() => handleEdit(profile)}>{profile.name}</span>}
                            />
                        </Box>
                        <input
                            accept="image/*"
                            type="file"
                            style={{ display: 'none' }}
                            id={`file-input-${profile.id}`}
                            onChange={(event) => handleImageChange(event, profile.id)}
                        />
                        <label htmlFor={`file-input-${profile.id}`}>
                            <Avatar
                                alt="Avatar"
                                src={`${profile.image}`}
                                style={{ cursor: 'pointer', width: 40, height: 40, marginLeft: 'auto' }}
                            />
                        </label>
                        <Box ml={2}>
                            <Button variant="outlined" onClick={() => handleEdit(profile)}>編集</Button>
                            <Button variant="outlined" data-id={`${profile.id}`} onClick={handleDelete}>削除</Button>
                        </Box>
                    </Box>
                ))}
            </FormGroup>
            <Dialog open={isDialogOpen} onClose={handleDialogClose}>
                <DialogTitle>プロファイル編集</DialogTitle>
                <DialogContent>
                    <TextField
                        label="名前"
                        variant="outlined"
                        size="small"
                        name="name"
                        value={selectedProfile ? selectedProfile.name : ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="性別"
                        variant="outlined"
                        select
                        size="small"
                        name="gender"
                        value={selectedProfile ? selectedProfile.gender : ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                        SelectProps={{ native: true }}
                    >
                        <option value=""></option>
                        <option value="male">男性</option>
                        <option value="female">女性</option>
                        <option value="other">その他</option>
                    </TextField>
                    <TextField
                        label="コメント"
                        variant="outlined"
                        size="small"
                        name="comments"
                        multiline
                        rows={3}
                        value={selectedProfile ? selectedProfile.comments : ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="アイテム数"
                        type="number"
                        variant="outlined"
                        size="small"
                        name="items"
                        value={selectedProfile ? selectedProfile.items : ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="年齢"
                        type="number"
                        variant="outlined"
                        size="small"
                        name="age"
                        value={selectedProfile ? selectedProfile.age : ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                    <TextField
                        label="居住地"
                        variant="outlined"
                        size="small"
                        name="place"
                        value={selectedProfile ? selectedProfile.place : ''}
                        onChange={handleInputChange}
                        fullWidth
                        margin="dense"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">キャンセル</Button>
                    <Button onClick={handleDialogSave} color="primary">保存</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ProfileComponent;
