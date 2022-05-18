using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.DTOs;
using AutoMapper;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace API.Controllers
{   //[Authorize] 
    public class UsersController : BaseApiController
    {
        //private readonly DataContext _context;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IPhotoService _photoService;
        
        public UsersController(IUserRepository userRepository, IMapper mapper, IPhotoService photoService){   // public UsersController(IUserRepository userRepository) //public UsersController(DataContext context){
            this._photoService = photoService;
            this._mapper = mapper;
            this._userRepository = userRepository;
            //this._context = context;
        }

        [HttpGet]        
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUsers(){  // public async Task<ActionResult<IEnumerable<AppUser>>> GetUsers()//public ActionResult<IEnumerable<AppUser>> GetUsers(){
            
            var users = await _userRepository.GetMembersAsync(); //var users = await _userRepository.GetUserAsync();
            //var usersToReturn = _mapper.Map<IEnumerable<MemberDto>>(users);
            Console.WriteLine("tim test");
            return Ok(users); //return Ok(usersToReturn);  // return Ok(await _userRepository.GetUserAsync()); // return await _context.Users.ToListAsync(); //return _context.Users.ToList();            
        }
        
        [HttpGet("{username}", Name ="GetUser")]  // [HttpGet("{username}")] // [HttpGet("{id}")]
        public async Task<ActionResult<MemberDto>> GetUser(string username){ // public async Task<ActionResult<AppUser>> GetUser(string username) // public async Task<ActionResult<AppUser>> GetUser(int id) //public ActionResult<AppUser> GetUser(int id){
            return await _userRepository.GetMemberAsync(username); //var user = await _userRepository.GetUserByUsernameAsync(username);
            
            //return _mapper.Map<MemberDto>(user);  // return await _userRepository.GetUserByUsernameAsync(username);//return await _context.Users.FindAsync(id); //return _context.Users.Find(id);            
        }

        [HttpPut]
        public async Task<ActionResult> UpdateUser(MemberUpdateDto memberUpdateDto){
            var username = "lisa"; //var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; //20220516 comment            
            var user = await _userRepository.GetUserByUsernameAsync(username);
            _mapper.Map(memberUpdateDto, user);
            _userRepository.Update(user);
            if (await _userRepository.SaveAllAsync()) return NoContent();
            return BadRequest("Failed to update user");
        }

        [HttpPost("add-photo")]
        public async Task<ActionResult<PhotoDto>> AddPohto(IFormFile file){
            var username = "lisa"; 
            var user = await _userRepository.GetUserByUsernameAsync(username); //20220517 Course 129 at 4:00. I hard code with lisa.
            var result = await _photoService.AddPhotoAsync(file);
            if (result.Error != null) return BadRequest(result.Error.Message);
            var photo = new Photo{
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId
            };

            if (user.Photo.Count ==0){
                photo.IsMain = true;
            }

            user.Photo.Add(photo);

            if (await _userRepository.SaveAllAsync()){
                return CreatedAtRoute("GetUser", new {username = user.UserName} ,_mapper.Map<PhotoDto>(photo));
                //return _mapper.Map<PhotoDto>(photo);
            }

            return BadRequest("Prolbem with loading photo");

        }

        [HttpPut ("set-main-photo/{photoId}")]
        public async Task<ActionResult> SetMainPhoto(int photoId){
            var username = "lisa"; 
            var user = await _userRepository.GetUserByUsernameAsync(username);
            var photo = user.Photo.FirstOrDefault(x=> x.Id == photoId);
            if (photo.IsMain) return BadRequest("This is already your main photo");
            var currentMain = user.Photo.FirstOrDefault(x =>x.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            if (await _userRepository.SaveAllAsync()) return NoContent();

            return BadRequest("Fail to set main photo");
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult> DeletePhoto(int photoId){
            var username = "lisa"; 
            var user = await _userRepository.GetUserByUsernameAsync(username);
            var photo = user.Photo.FirstOrDefault(x =>x.Id == photoId);
            if (photo is null) return NotFound();
            if (photo.IsMain) return BadRequest("You can not delete your main photo");
            if(photo.PublicId != null){
                var result = await _photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null) return BadRequest(result.Error.Message);
            }
            user.Photo.Remove(photo);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Fail to delete photo");

        }





    }
}