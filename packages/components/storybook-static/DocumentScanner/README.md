# Scanner Integration

## Description

The scanner integration is the capability to scan documents directly from the
browser. We can trigger scans, process the images, and upload a combination of
them as PDF without going out of the website.

![Screenshot 2023-03-01 at 12 11 16](https://user-images.githubusercontent.com/1247754/222348164-60e6a244-ef44-4a67-bf17-c31352367917.png)

## Technical decision

The analysis of the different options, and what lead us to use Dynamsoft, is
documented in
[this issue](https://github.com/KitmanLabs/projects/issues/30232#issuecomment-1436420716).

At the moment of creating the feature, the only way to trigger a scan from a
browser is to use a bridge software program on the machine of the customer
(putting aside TWAIN Cloud as it is not supported by the NFL scanners).
Dynamsoft is one of those software programs. It runs at all times in the
background. It creates a localhost server on the machine so the Kitman can send
commands to the scanner through the software application.

## Concerns

**The main concerns are:**

- Security: Installing a third-party software program on the NFL employees'
  machine for processing confidential documents is scary
- Lack of control: A lot of things can go wrong, from Dynamsoft bugs to hardware
  problems, driver issues etc... Things that we can't investigate easily and
  that we don't have control over. The frustration could be directed toward
  Kitman and we would have no control over it

**Other problem mentioned but not as critical:**

- Testability: Their library is not compatible with JSDOM, which is used for our
  automated testing. It means that we can't have automated testing for this
  feature at the moment
- Their code example is a bit outdated. It did not reassure us about the code
  that we can't see The library has a very unusual way of being included. We
  need to copy a part of the library and their software installers to a resource
  folder on our server. Having their software installers there makes sense if we
  want the user to download them from our server. However, the library part is a
  bit strange. The library imported in our code fetches the other part of the
  library from our server and runs it on initialisation. Nothing too wrong about
  it, but just unusual
- It injects some styles into the HTML. Nothing that conflicts with ours, but it
  is quite intrusive. We should have control over how we want those things
  included

## Partition of the code from the rest of the application

The decision of introducing the feature despite the concerns has been approved
by both the engineer and product leadership. It has also been approved by the
NFL.

However, we do not want this feature and Dynamsoft code to run on any other
customers that the NFL. This is why we check for both the feature flag and
sports organisation before showing the feature. We also load the library
asynchronously so the library is not loaded for other customers.

## Architecture

The content of the `/dwt` folder comes straight from
[their example](https://github.com/Dynamsoft/web-twain-react-advanced). We
removed a lot of code and adapted it a bit so it looks closer to our code
standards. However, it still looks out of place and could be refactored further
if given time.

We also copy `node_modules/dwt/dist` to `public/dwt-resource`, as mentioned in
dwt documentation. It contains their software, so the user can download it from
our servers. It also contains part of the library that `dwt` fetches on
initialisation.

`buil/dwt-resource` is not included in the published `@kitman/profiler` package.
This is because the executables weight about 100MB. It brings the package over
GemFury size allowance. The folder is excluded in the `file` section of
`profiler/package.json`. Then, we include it back as part of the pre-build in
`medinah`.

## Software upgrade

When upgrading the javascript library, the user will also be prompted to upgrade
their software
